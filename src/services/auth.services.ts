import { Student } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { loginPick, userPick, UserRole } from "../utils/format.server";
import { prisma } from "../utils/prisma.server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const secret = process.env.ACCESS_TOKEN_SECRET;

export class authServices {

  static async registerMultiple(usersData: UserRole[]) {
    try {
      const newUsers = await Promise.all(usersData.map(async (userData) => {
        const { user, password, name, role } = userData;
        if (!user || !password || !name ) {
          throw new Error('Datos incompletos. Asegúrate de proporcionar email, password, firstName y lastName.');
        }
        if (!password) {
          throw new Error('La contraseña no puede estar vacía.');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await prisma.student.create({
          data: {
            user,
            password: passwordHash,
            name,
            role,
          },
        });
        return newUser;
      }));
      return newUsers;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Error: Email ya existente.');
        }
      }
      throw error;
    }
  }

  // Realizar un LOGIN
  static async login(data: loginPick) {
    try {
      const { user, password } = data;
      const students = await prisma.student.findMany({
        where: { user }, // Busca todos los estudiantes con el nombre de usuario proporcionado
        select: {
          id: true,
          user: true,
          password: true,
          token: true,
        },
      });
      // Verifica la contraseña para cada estudiante encontrado
      for (const student of students) {
        const verifyPassword = await bcrypt.compare(password, student.password);
        if (verifyPassword) return student.id; // Retorna el ID del estudiante si la contraseña es correcta
      }
      // Si no se encontró ningún estudiante con la contraseña correcta, retorna null
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Generar un TOKEN
  static getToken(data: userPick) {
    try {
      if (secret) {
        const token = jwt.sign(data, secret, { algorithm: "HS256" });
        console.log('Token generado:', token);
        return token;
      }
    } catch (error) {
      throw error;
    }
  }
}
export default authServices;