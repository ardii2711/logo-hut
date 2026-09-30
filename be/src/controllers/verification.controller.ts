import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const verifySubmissionCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.params.code as string;

    // Validasi format code
    const codeRegex = /^MATENG-[A-Z0-9]{6}$/;
    if (!codeRegex.test(code)) {
      res.status(400).json({
        valid: false,
        error: 'Format kode submission tidak valid',
      });
      return;
    }

    // Cek di database
    const submission = await prisma.submission.findUnique({
      where: { submissionCode: code },
      select: { id: true },
    });

    if (!submission) {
      res.status(404).json({
        valid: false,
        error: 'Kode submission tidak ditemukan',
      });
      return;
    }

    res.json({ valid: true });
  } catch (error) {
    console.error('Error verifying submission code:', error);
    res.status(500).json({
      valid: false,
      error: 'Terjadi kesalahan saat memverifikasi kode',
    });
  }
};
