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
      const usedRange = sheet.usedRange();
      const endRow = usedRange.bottomRight().rowNumber();

      const groups: string[] = [];
      const names: string[] = [];
      const users: string[] = [];
      const passwords: string[] = [];
      const roles: Role[] = [];

      for (let i = 2; i <= endRow; i++) {
        const group = sheet.cell(`B${i}`).value();
        const name = sheet.cell(`E${i}`).value();
        const user = sheet.cell(`T${i}`).value();
        const password = sheet.cell(`U${i}`).value();
        const role = sheet.cell(`V${i}`).value();

        groups.push(group);
        names.push(name);
        users.push(user);
        passwords.push(password);
        roles.push(role);
      }

      const usersData = groups.map((group, index) => ({
        group,
        name: names[index],
        user: users[index],
        password: passwords[index],
        role: roles[index],
      }));

      req.userData = usersData;

      await Promise.all(usersData.map(async (userData) => {
        const { name, user, password, role } = userData;
        await authServices.registerMultiple([{ name, user, password, role }]);
      }));

      for (const group of groups) {
        const cycleId = await obtenerId(group) ?? -1;
        const groupData = { name: group, cycleId, link: undefined };
        await groupService.create([groupData]);
      }

      next();
    } catch (error: any) {
      console.error('Error al procesar el archivo Excel:', error);
      return res.status(500).json({ error: 'Error interno al procesar el archivo Excel', errorMessage: error.message });
    }
  });
};

export default excelUpload;

const obtenerId = async (groupName: string): Promise<number | null> => {
  try {
    const cycle = await cycleService.getCycle(groupName);
    if (cycle) {
      return cycle.id;
    } else {
      console.error('No se encontró el ciclo correspondiente.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el ID del ciclo:', error);
    throw error;
  }
};
