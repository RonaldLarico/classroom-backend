import { Request as ExpressRequest, Response, NextFunction } from 'express';
import path from 'path';
import multer from 'multer';
import xlsxPopulate from 'xlsx-populate';
import { PrismaClient } from '@prisma/client';
import { Role, UserData } from '../utils/format.server';
import { groupService } from '../services/group.services';
import { cycleService } from '../services/cycle.services';
import authServices from '../services/auth.services';

interface RequestWithStudentsData extends ExpressRequest {
  userData?: UserData[];
  groupData?: any[];
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/excel');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).any();

const excelUpload = async (
  req: RequestWithStudentsData,
  res: Response,
  next: NextFunction
) => {
  console.log("Entrando a ......excel")
  upload(req, res, async (err) => {
    if (err) {
      console.log("Error al subir el archivo: ", err)
      return res.status(400).json({ error: 'Error al cargar el archivo Excel' });
    }
    console.log("Archivo subido correctamente")
    if (!Array.isArray(req.files)) {
      // Si req.files no es un array, entonces asumimos que es un objeto con campos de archivo
      if (!req.files || !req.files['excelFile']) {
        console.log("Ningún archivo proporcionado")
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
      }
    } else {
      // Si req.files es un array, entonces asumimos que contiene los archivos directamente
      if (!req.files || req.files.length === 0) {
        console.log("Ningún archivo proporcionado")
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
      }
    }
    const fileName = Array.isArray(req.files) ? req.files[0].originalname : req.files['excelFile'][0].originalname;
    const filePath = path.join(process.cwd(), 'uploads', 'excel', fileName);
    console.log('Ruta del archivo:', filePath);

    try {
      const workbook = await xlsxPopulate.fromFileAsync(filePath);
      const sheet = workbook.sheet(0);
      const usedRange = findUsedRange(sheet);
       // Verificamos si usedRange es un objeto y si tiene el método bottomRight()
      if (!usedRange || typeof usedRange.bottomRight !== 'function') {
        throw new Error('La propiedad usedRange no es válida');
      }
      const endRow = usedRange.bottomRight().rowNumber();

      const userData: UserData[] = [];
      const groupData: any[] = [];

      for (let i = 2; i <= endRow; i++) {
        const groupName = sheet.cell(`B${i}`).value();
        const name = sheet.cell(`C${i}`).value();
        const user = sheet.cell(`D${i}`).value();
        const password = String(sheet.cell(`E${i}`).value());
        const role = sheet.cell(`F${i}`).value();
        const link = sheet.cell(`G${i}`).value();
        const cycleName = sheet.cell(`H${i}`).value();

        const userItem = {
          name,
          user,
          password,
          role
        };
        const groupItem = {
          groupName,
          link,
          cycleName
        };

        userData.push(userItem);
        groupData.push(groupItem);
      }
      req.userData = userData;
      req.groupData = groupData;
      console.log('Tipo de req.userData:', typeof req.userData);


      console.log(groupData);
      console.log(userData);
      console.log('Tipo de userData:', typeof userData);

      // Verificar si usersData está definido y si tiene al menos un elemento
      if (!userData || userData.length === 0) {
        // Manejar el caso cuando usersData no está definido o está vacío
        throw new Error('usersData no está definido o está vacío');
      }

      await authServices.registerMultiple(userData);

      for (const item of groupData) {
        await groupService.create(item);
      }

      console.log('groupData:', groupData);
console.log('groupData length:', groupData.length);


      next();
    } catch (error: any) {
      console.error('Error al procesar el archivo Excel:', error);
      return res.status(500).json({ error: 'Error interno al procesar el archivo Excel', errorMessage: error.message });
    }
  });
};

export default excelUpload;

function findUsedRange(sheet: any) {
  let startRow = Infinity;
  let endRow = 0;
  let startCol = Infinity;
  let endCol = 0;

  const usedCells = sheet.usedRange().value();

  usedCells.forEach((row: any, rowIndex: number) => {
    row.forEach((cell: any, colIndex: number) => {
      if (cell !== null && cell !== undefined && cell !== '') {
        if (rowIndex < startRow) {
          startRow = rowIndex;
        }
        if (rowIndex > endRow) {
          endRow = rowIndex;
        }
        if (colIndex < startCol) {
          startCol = colIndex;
        }
        if (colIndex > endCol) {
          endCol = colIndex;
        }
      }
    });
  });

  return {
    bottomRight: () => ({
      rowNumber: () => endRow + 1,
      columnNumber: () => endCol + 1
    })
  };
}
