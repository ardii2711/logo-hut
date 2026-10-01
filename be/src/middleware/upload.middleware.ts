import multer from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  const allowedMimes: Record<string, string[]> = {
    ktp_file: ['image/jpeg', 'image/png', 'application/pdf'],
    logo_vector_file: ['application/pdf', 'application/postscript', 'application/illustrator', 'application/octet-stream'], // AI/EPS/CDR/PDF
    logo_png_file: ['image/png'],
    logo_jpeg_file: ['image/jpeg'],
    filosofi_pdf_file: ['application/pdf'],
    surat_pernyataan_file: ['image/jpeg', 'image/png', 'application/pdf'],
  };

  const allowedExts: Record<string, string[]> = {
    logo_vector_file: ['.ai', '.eps', '.cdr', '.pdf'],
  };

  const mimes = allowedMimes[file.fieldname];
  if (!mimes) {
    return cb(null, false);
  }

  // ponytail: CDR/AI detection by extension fallback
  if (file.fieldname === 'logo_vector_file') {
    const extOk = allowedExts.logo_vector_file.includes(ext);
    return cb(null, extOk);
  }

  cb(null, mimes.includes(file.mimetype));
};

export const uploadSubmission = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 45 * 1024 * 1024, // 45MB max (vector file)
  },
}).fields([
  { name: 'ktp_file', maxCount: 1 },
  { name: 'logo_vector_file', maxCount: 1 },
  { name: 'logo_png_file', maxCount: 1 },
  { name: 'logo_jpeg_file', maxCount: 1 },
  { name: 'filosofi_pdf_file', maxCount: 1 },
  { name: 'surat_pernyataan_file', maxCount: 1 },
]);
