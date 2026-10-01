import { z } from 'zod';

export const SubmissionSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  whatsapp: z.string().min(10, 'Nomor WhatsApp tidak valid'),
  title: z.string().min(5, 'Judul karya minimal 5 karakter').max(200, 'Judul maksimal 200 karakter'),
});

export const LoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

// File validation helpers
export function validateFileType(mimetype: string, allowed: string[]): boolean {
  return allowed.includes(mimetype);
}

export function validateFileSize(size: number, maxMB: number): boolean {
  return size <= maxMB * 1024 * 1024;
}
