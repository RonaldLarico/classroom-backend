import { Student } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { loginPick, UserData, userPick, UserRole } from "../utils/format.server";
import { prisma } from "../utils/prisma.server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

export interface StudentWithGroups extends Student {
  groups?: string[];
}

dotenv.config();
const secret = process.env.ACCESS_TOKEN_SECRET;

export class authServices {

  static async registerMultiple(usersData: UserData[]) {
    if (!Array.isArray(usersData)) {
      throw new Error('usersData debe ser un array');
    }
    try {
      const newUsers: Student[] = [];
      for (const userData of usersData) {
        const { user, password, name, role, groupName } = userData;
        if (!user || !password || !name || !role || !groupName) {
          throw new Error('Datos incompletos. Asegúrate de proporcionar name, password, role y user.');
        }
        if (!password) {
          throw new Error('La contraseña no puede estar vacía.');
        }
        const passwordHash = await bcrypt.hash(password, 10);
  
        // Buscar todos los grupos correspondientes por el nombre del grupo
        const groups = await prisma.group.findMany({
          where: {
            groupName
          },
          include: {
            cycle: true,
          }
        });
  
        if (!groups || groups.length === 0) {
          throw new Error(`No se encontró un grupo con el nombre ${groupName}`);
        }
  
        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await prisma.student.findFirst({
          where: {
            user: String(user)
          }
        });
  
        if (existingUser) {
          // El usuario ya existe, verificar si las contraseñas coinciden
          const passwordMatch = await bcrypt.compare(password, existingUser.password);
          if (passwordMatch) {
            // Las contraseñas coinciden, no es necesario crear un nuevo usuario
            newUsers.push(existingUser);
          } else {
            // Las contraseñas no coinciden, lanzar un error
            throw new Error('La contraseña no coincide con el usuario existente.');
          }
        } else {
          // El usuario no existe, creamos uno nuevo
          const newUser = await prisma.student.create({
            data: {
              user: String(user),
              password: passwordHash,
              name: name,
              role: role
            }
          });
          newUsers.push(newUser);
        }
  
        // Para cada grupo encontrado, verificar y crear asociación si no existe
        for (const group of groups) {
          const existingAssociation = await prisma.studentOnGroups.findFirst({
            where: {
              studentId: newUsers[newUsers.length - 1].id, // Usamos el ID del usuario existente o del nuevo usuario
              groupId: group.id
            }
          });
  
          if (!existingAssociation) {
            // Asociar el usuario al grupo si no está asociado previamente
            await prisma.studentOnGroups.create({
              data: {
                student: {
                  connect: {
                    id: existingUser?.id || newUsers[newUsers.length - 1].id // Usamos el ID del usuario existente o del nuevo usuario
                  }
                },
                group: {
                  connect: {
                    id: group.id
                  }
                }
              }
            });
          }
        }
      }
  
      return newUsers;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
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