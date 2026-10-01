import { Request, Response, NextFunction } from 'express';
import { SubmissionSchema, validateFileSize } from '../validations/submission.schema';
import { createSubmission } from '../services/submission.service';
import path from 'path';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validate 6 files exist
    const requiredFiles = ['ktp_file', 'logo_vector_file', 'logo_png_file', 'logo_jpeg_file', 'filosofi_pdf_file', 'surat_pernyataan_file'];
    const missingFiles = requiredFiles.filter(field => !files?.[field]?.[0]);
    
    if (missingFiles.length > 0) {
      res.status(400).json({
        success: false,
        error: `File wajib: ${missingFiles.join(', ')}`,
      });
      return;
    }

    const ktpFile = files.ktp_file[0];
    const logoVectorFile = files.logo_vector_file[0];
    const logoPngFile = files.logo_png_file[0];
    const logoJpegFile = files.logo_jpeg_file[0];
    const filosofiPdfFile = files.filosofi_pdf_file[0];
    const suratPernyataanFile = files.surat_pernyataan_file[0];

    // Validate file sizes
    if (!validateFileSize(ktpFile.size, 5)) {
      res.status(400).json({ success: false, error: 'Ukuran file KTP maksimal 5MB' });
      return;
    }

    if (!validateFileSize(logoVectorFile.size, 45)) {
      res.status(400).json({ success: false, error: 'Ukuran file vektor maksimal 45MB' });
      return;
    }

    if (!validateFileSize(logoPngFile.size, 10)) {
      res.status(400).json({ success: false, error: 'Ukuran file PNG maksimal 10MB' });
      return;
    }

    if (!validateFileSize(logoJpegFile.size, 10)) {
      res.status(400).json({ success: false, error: 'Ukuran file JPEG maksimal 10MB' });
      return;
    }

    if (!validateFileSize(filosofiPdfFile.size, 5)) {
      res.status(400).json({ success: false, error: 'Ukuran file filosofi PDF maksimal 5MB' });
      return;
    }

    if (!validateFileSize(suratPernyataanFile.size, 5)) {
      res.status(400).json({ success: false, error: 'Ukuran file surat pernyataan maksimal 5MB' });
      return;
    }

    // Validate vector file extension
    const vectorExt = path.extname(logoVectorFile.originalname).toLowerCase();
    if (!['.ai', '.eps', '.cdr', '.pdf'].includes(vectorExt)) {
      res.status(400).json({
        success: false,
        error: 'Format file vektor harus AI, EPS, CDR, atau PDF',
      });
      return;
    }

    // Validate PNG
    if (logoPngFile.mimetype !== 'image/png') {
      res.status(400).json({ success: false, error: 'File logo PNG harus format PNG' });
      return;
    }

    // Validate JPEG
    if (logoJpegFile.mimetype !== 'image/jpeg') {
      res.status(400).json({ success: false, error: 'File logo JPEG harus format JPEG' });
      return;
    }

    // Validate filosofi PDF
    if (filosofiPdfFile.mimetype !== 'application/pdf') {
      res.status(400).json({ success: false, error: 'File filosofi harus format PDF' });
      return;
    }

    // Validate form data
    const validation = SubmissionSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.errors[0].message,
      });
      return;
    }

    // Create submission
    const submissionCode = await createSubmission({
      ...validation.data,
      ktpFile,
      logoVectorFile,
      logoPngFile,
      logoJpegFile,
      filosofiPdfFile,
      suratPernyataanFile,
    });

    res.status(201).json({
      success: true,
      data: { submissionCode },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('sudah terdaftar')) {
        res.status(409).json({
          success: false,
          error: error.message,
        });
        return;
      }
    }
    next(error);
  }
}
