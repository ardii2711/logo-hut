import { prisma } from '../config/prisma';
import { uploadFile, deleteFiles } from './storage.service';
import { generateSubmissionCode } from '../utils/generate-code';
import { normalizeWhatsApp } from '../utils/normalize-phone';
import { randomUUID } from 'crypto';
import path from 'path';

interface CreateSubmissionData {
  name: string;
  email: string;
  whatsapp: string;
  title: string;
  ktpFile: Express.Multer.File;
  logoVectorFile: Express.Multer.File;
  logoPngFile: Express.Multer.File;
  logoJpegFile: Express.Multer.File;
  filosofiPdfFile: Express.Multer.File;
  suratPernyataanFile: Express.Multer.File;
}

function getFileExtension(file: Express.Multer.File): string {
  return path.extname(file.originalname).toLowerCase().replace('.', '');
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
  const basePath = `submissions/${submissionCode}`;

  // Build file paths
  const ktpExt = getFileExtension(data.ktpFile);
  const vectorExt = getFileExtension(data.logoVectorFile);
  const suratExt = getFileExtension(data.suratPernyataanFile);

  const filePaths = {
    ktp: `${basePath}/ktp.${ktpExt}`,
    vector: `${basePath}/logo-vector.${vectorExt}`,
    png: `${basePath}/logo-png.png`,
    jpeg: `${basePath}/logo-jpeg.jpg`,
    filosofi: `${basePath}/filosofi.pdf`,
    surat: `${basePath}/surat-pernyataan.${suratExt}`,
  };

  const uploadedPaths: string[] = [];

  try {
    // Upload 6 files sequentially with rollback tracking
    await uploadFile(filePaths.ktp, data.ktpFile.buffer, data.ktpFile.mimetype);
    uploadedPaths.push(filePaths.ktp);

    await uploadFile(filePaths.vector, data.logoVectorFile.buffer, data.logoVectorFile.mimetype);
    uploadedPaths.push(filePaths.vector);

    await uploadFile(filePaths.png, data.logoPngFile.buffer, data.logoPngFile.mimetype);
    uploadedPaths.push(filePaths.png);

    await uploadFile(filePaths.jpeg, data.logoJpegFile.buffer, data.logoJpegFile.mimetype);
    uploadedPaths.push(filePaths.jpeg);

    await uploadFile(filePaths.filosofi, data.filosofiPdfFile.buffer, data.filosofiPdfFile.mimetype);
    uploadedPaths.push(filePaths.filosofi);

    await uploadFile(filePaths.surat, data.suratPernyataanFile.buffer, data.suratPernyataanFile.mimetype);
    uploadedPaths.push(filePaths.surat);

    // Save to DB
    const submission = await prisma.submission.create({
      data: {
        id: submissionId,
        submissionCode,
        name: data.name,
        email: data.email,
        whatsapp: normalizedPhone,
        title: data.title,
        ktpFilePath: filePaths.ktp,
        logoVectorFilePath: filePaths.vector,
        logoPngFilePath: filePaths.png,
        logoJpegFilePath: filePaths.jpeg,
        filosofiPdfFilePath: filePaths.filosofi,
        suratPernyataanFilePath: filePaths.surat,
      },
    });

    return submission.submissionCode;
  } catch (error) {
    // Rollback: delete all uploaded files
    if (uploadedPaths.length > 0) {
      await deleteFiles(uploadedPaths).catch(() => {});
    }
    throw error;
  }
}
