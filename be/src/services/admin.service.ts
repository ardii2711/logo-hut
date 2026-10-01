import { prisma } from '../config/prisma';
import { getSignedUrl } from './storage.service';

interface ListSubmissionsParams {
  search?: string;
  page: number;
  limit: number;
}

export async function listSubmissions(params: ListSubmissionsParams) {
  const { search, page, limit } = params;
  const skip = (page - 1) * limit;

  // Build where clause for search
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { whatsapp: { contains: search, mode: 'insensitive' as const } },
          { submissionCode: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [submissions, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        submissionCode: true,
        name: true,
        email: true,
        whatsapp: true,
        title: true,
        createdAt: true,
      },
    }),
    prisma.submission.count({ where }),
  ]);

  return {
    submissions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSubmissionDetail(id: string) {
  const submission = await prisma.submission.findUnique({
    where: { id },
  });

  if (!submission) {
    throw new Error('Submission tidak ditemukan');
  }

  // Generate signed URLs (expire in 1 hour = 3600s)
  // ponytail: graceful fallback if file missing
  let ktpFileUrl = '';
  let logoFileUrl = '';

  try {
    [ktpFileUrl, logoFileUrl] = await Promise.all([
      getSignedUrl('submissions', submission.ktpFilePath, 3600).catch((err) => {
        console.warn(`KTP file not found: ${submission.ktpFilePath}`, err.message);
        return ''; // Return empty string if file missing
      }),
      getSignedUrl('submissions', submission.logoFilePath, 3600).catch((err) => {
        console.warn(`Logo file not found: ${submission.logoFilePath}`, err.message);
        return ''; // Return empty string if file missing
      }),
    ]);
  } catch (error) {
    console.error('Error generating signed URLs:', error);
  }

  return {
    id: submission.id,
    submissionCode: submission.submissionCode,
    name: submission.name,
    email: submission.email,
    whatsapp: submission.whatsapp,
    title: submission.title,
    description: submission.description,
    ktpFileUrl,
    logoFileUrl,
    createdAt: submission.createdAt,
  };
}
