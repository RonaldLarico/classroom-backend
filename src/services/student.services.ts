import { Student } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma.server";
import { UserRole, UserUpdate } from "../utils/format.server";
import jwt from "jsonwebtoken";
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
        password: true,
        name: true,
        role: true,
        groups: {
          include: {
            group: {
              select: {
                groupName: true,
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
          password: true,
          name: true,
          role: true,
          groups: {
            include: {
              group: {
                select: {
                  groupName: true,
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
}
export default studentServices;
