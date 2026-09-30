import { PrismaClient } from '@prisma/client';
import { uploadFile, deleteFile } from './storage.service';
import { generateSubmissionCode } from '../utils/generate-code';
import { normalizeWhatsApp } from '../utils/normalize-phone';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

interface CreateSubmissionData {
  name: string;
  email: string;
  whatsapp: string;
  title: string;
  description: string;
  ktpFile: Express.Multer.File;
  logoFile: Express.Multer.File;
}

export async function createSubmission(data: CreateSubmissionData) {
  const normalizedPhone = normalizeWhatsApp(data.whatsapp);

  // Check duplicates
  const existing = await prisma.submission.findFirst({
    where: {
      OR: [
        { email: data.email },
        { whatsapp: normalizedPhone },
      ],
    },
  });

  if (existing) {
    if (existing.email === data.email) {
      throw new Error('Email sudah terdaftar');
    }
    if (existing.whatsapp === normalizedPhone) {
      throw new Error('Nomor WhatsApp sudah terdaftar');
    }
  }

  const submissionCode = generateSubmissionCode();
  const submissionId = randomUUID();

  // Upload files
  const ktpExt = data.ktpFile.mimetype.split('/')[1];
  const logoExt = data.logoFile.mimetype.split('/')[1];

  const ktpPath = `ktp/${submissionId}.${ktpExt}`;
  const logoPath = `logo/${submissionId}.${logoExt}`;

  try {
    await uploadFile('submissions', ktpPath, data.ktpFile.buffer, data.ktpFile.mimetype);
    await uploadFile('submissions', logoPath, data.logoFile.buffer, data.logoFile.mimetype);

    // Save to DB
    const submission = await prisma.submission.create({
      data: {
        id: submissionId,
        submissionCode,
        name: data.name,
        email: data.email,
        whatsapp: normalizedPhone,
        title: data.title,
        description: data.description,
        ktpFilePath: ktpPath,
        logoFilePath: logoPath,
      },
    });

    return submission.submissionCode;
  } catch (error) {
    // Rollback: delete uploaded files
    await deleteFile('submissions', ktpPath).catch(() => {});
    await deleteFile('submissions', logoPath).catch(() => {});
    throw error;
  }
}
