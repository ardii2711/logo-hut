import { Request, Response, NextFunction } from 'express';
import { SubmissionSchema, validateFileSize, validateFileType } from '../validations/submission.schema';
import { createSubmission } from '../services/submission.service';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validate files exist
    if (!files?.ktp_file?.[0] || !files?.logo_file?.[0]) {
      res.status(400).json({
        success: false,
        error: 'File KTP dan Logo wajib diunggah',
      });
      return;
    }

    const ktpFile = files.ktp_file[0];
    const logoFile = files.logo_file[0];

    // Validate file sizes
    if (!validateFileSize(ktpFile.size, 5)) {
      res.status(400).json({
        success: false,
        error: 'Ukuran file KTP maksimal 5MB',
      });
      return;
    }

    if (!validateFileSize(logoFile.size, 10)) {
      res.status(400).json({
        success: false,
        error: 'Ukuran file Logo maksimal 10MB',
      });
      return;
    }

    // Validate file types
    if (!validateFileType(ktpFile.mimetype, ['image/jpeg', 'image/png', 'application/pdf'])) {
      res.status(400).json({
        success: false,
        error: 'Format file KTP harus JPG, PNG, atau PDF',
      });
      return;
    }

    if (!validateFileType(logoFile.mimetype, ['image/jpeg', 'image/png'])) {
      res.status(400).json({
        success: false,
        error: 'Format file Logo harus PNG atau JPG',
      });
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
      logoFile,
    });

    res.status(201).json({
      success: true,
      data: { submissionCode },
    });
  } catch (error) {
    if (error instanceof Error) {
      // Business logic errors (duplicate email/whatsapp)
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
