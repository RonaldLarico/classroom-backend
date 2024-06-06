/* import multer, { Multer, FileFilterCallback } from 'multer';
import { Request } from 'express';

const excelFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
  //cb: (error: Error | null, acceptFile: boolean) => void
) => {
  if (
    file.mimetype.includes('excel') ||
    file.mimetype.includes('spreadsheetml')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only excel file') as any, false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/uploads');
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});

const uploadFile: Multer = multer({ storage, fileFilter: excelFilter });

export default uploadFile; */