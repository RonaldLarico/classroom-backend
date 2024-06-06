import multer, { StorageEngine } from 'multer';
import { Request, Response } from 'express';
import path from 'path';

declare module 'express' {
  interface Request {
    fileId?: string;
  }
};

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/certificate');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileId = `image-${unique}${path.extname(file.originalname)}`;
    cb(null, fileId);
    req.fileId = fileId;
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error( 'Solo se permiten archivos de imagen!' ) as any, false);
  }
};

const upload = multer({ storage, fileFilter });

export const imageUpload = upload.single('imageCertificate');