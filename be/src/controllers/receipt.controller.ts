import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { generateReceiptPDF } from '../services/pdf.service';

export const getReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.params.code as string;

    // Validasi format code
    const codeRegex = /^MATENG-[A-Z0-9]{6}$/;
    if (!codeRegex.test(code)) {
      res.status(400).json({
        success: false,
        error: 'Format kode submission tidak valid',
      });
      return;
    }

    // Ambil data submission dari database
    const submission = await prisma.submission.findUnique({
      where: { submissionCode: code },
    });

    if (!submission) {
      res.status(404).json({
        success: false,
        error: 'Submission tidak ditemukan',
      });
      return;
    }

    // Generate PDF
    const doc = generateReceiptPDF(submission);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Bukti-Submission-${code}.pdf"`
    );

    // Pipe PDF ke response
    doc.pipe(res);
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan saat membuat bukti pengiriman',
    });
  }
};
