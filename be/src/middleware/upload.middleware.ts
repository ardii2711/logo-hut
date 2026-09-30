import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ktpMimes = ['image/jpeg', 'image/png', 'application/pdf'];
  const logoMimes = ['image/jpeg', 'image/png'];

  if (file.fieldname === 'ktp_file') {
    cb(null, ktpMimes.includes(file.mimetype));
  } else if (file.fieldname === 'logo_file') {
    cb(null, logoMimes.includes(file.mimetype));
  } else {
    cb(null, false);
  }
};

export const uploadSubmission = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
}).fields([
  { name: 'ktp_file', maxCount: 1 },
  { name: 'logo_file', maxCount: 1 },
]);
