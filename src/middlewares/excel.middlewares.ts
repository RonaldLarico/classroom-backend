import { Request as ExpressRequest, Response, NextFunction } from 'express';
import path from 'path';
import multer from 'multer';
import * as xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';
import { Role, UserData } from '../utils/format.server';
import { groupService } from '../services/group.services';
import { cycleService } from '../services/cycle.services';
import authServices from '../services/auth.services';

interface RequestWithStudentsData extends ExpressRequest {
  userData?: UserData[];
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/excel');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single('excelFile');

const excelUpload = async (
  req: RequestWithStudentsData,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Error al cargar el archivo Excel' });
    }
    if (!req.file || !req.file.originalname) {
      return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
    }
    const fileName = req.file.originalname;
    console.log(fileName);
    const filePath = path.join(process.cwd(), 'uploads', 'excel', fileName);
    console.log(filePath);
    try {
      console.log(filePath);
      const workbook = xlsx.readFile(filePath, { cellFormula: false});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let endRow;
      if (sheet['!ref']) {
        endRow = sheet['!ref'].split(':')[1]; // Obtén la segunda parte de la referencia si la primera parte existe
      } else {
        console.error('La propiedad "!ref" de la hoja es undefined.');
      }
      const range = { s: { c: 1, r: 2 }, e: { c: 6, r: endRow } }; // Columnas B (1) a V (21), fila 5 en adelante

      // Convertir las celdas en JSON, tomando solo las celdas dentro del rango especificado
      const data: unknown[][] = xlsx.utils.sheet_to_json(sheet, { header: 1, range: range }) as unknown[][];

      // Extraer los datos de cada columna
      const groups = data.map(row => row[0]) as string[]; // Columna B (index 0)
      const names = data.map(row => row[1]) as string[]; // Columna E (index 4)
      const users = data.map(row => row[2]) as string[]; // Columna T (index 19)
      const passwords = data.map(row => row[3]) as string[]; // Columna U (index 20)
      const roles = data.map(row => row[4]) as Role[]; // Columna V (index 21)

      // Registrar los usuarios en la base de datos
      const usersData = [];
      for (let i = 0; i < names.length; i++) {
        const userData = {
          group: groups[i],
          name: names[i],
          user: users[i],
          password: passwords[i],
          role: roles[i],
        };
        usersData.push(userData);
      }
      console.log(usersData);
      req.userData = usersData;
      // Registrar usuarios de forma individual
      if (!Array.isArray(usersData)) {
        console.error('usersData no es un array');
        return res.status(500).json({ error: 'Error interno: datos de usuario no válidos' });
      }

      await Promise.all(usersData.map(async (userData) => {
        const { name, user, password, role } = userData;
        await authServices.registerMultiple([{ name, user, password, role }]);
      }));

      for (const group of groups) {
        const cicleIdPromise = obtenerId(group);
        const cicleeId = await cicleIdPromise ?? -1;
        await groupService.create([{ name: group, cicleId: cicleeId }]); // Llama al método create del groupService
      }
      next();
    } catch (error) {
      console.error('Error al procesar el archivo Excel:', error);
      return res.status(500).json({ error: 'Error interno al procesar el archivo Excel' });
    }
  });
};

export default excelUpload;

const obtenerId = async (groupName: string): Promise<number | null> => {
  try {
    const cicle = await cycleService.getCycle(groupName); // Obtiene el ciclo a partir del nombre del grupo
    if (cicle) {
      return cicle.id; // Devuelve el ID del ciclo
    } else {
      console.error('No se encontró el ciclo correspondiente.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el ID del ciclo:', error);
    throw error;
  }
};