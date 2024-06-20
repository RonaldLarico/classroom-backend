import { Student } from '@prisma/client';
import { prisma } from "../utils/prisma.server";
import { UserUpdate } from "../utils/format.server";
import * as dotenv from 'dotenv';

dotenv.config();

export class studentServices {

  static async getStudent(id: Student["id"]) {
  try {
    const result = await prisma.student.findUnique({
      where: { id },
      select:{
        id: true,
        user: true,
        name: true,
        role: true,
        active: true,
        groups: {
          include: {
            group: {
              select: {
                groupName: true,
                link: true,
                cycle: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
      }
    })
    return result;
  } catch (error) {
    throw error;
  }
}

  // Mostrar todos los 'USER' & 'ADMIN'
  static async getAll(
    take: number,
    skip: number
  ) {
    try {
      const result = await prisma.student.findMany({
        orderBy: { id: "asc" },
        select: {
          id: true,
          user: true,
          name: true,
          role: true,
          active: true,
          groups: {
            include: {
              group: {
                select: {
                  groupName: true,
                  link: true,
                  cycle: {
                    select: {
                      name: true,
                    }
                  }
                }
              }
            }
          }
        },
        take,
        skip,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(data:UserUpdate, id: Student["id"]) {
    try {
      const {
        user,
        name,
        role,
      } = data;
      if (role === undefined) {
        throw new Error('La propiedad "role" en el objeto es undefined.');
      }
      const result = await prisma.student.update({
        where: { id },
        data: {
          user,
          name,
          role,
        }
      });
      return result;
    }catch (error) {
      throw error;
    }
  }

  static async delete(id: Student["id"]) {
    try {
      const result = await prisma.student.delete({
        where: { id },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteMany(){
    try {
      const result = await prisma.student.deleteMany();
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default studentServices;
