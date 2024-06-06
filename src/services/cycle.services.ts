import { Cicle, Student } from "@prisma/client";
import { prisma } from "../utils/prisma.server";

export class cycleService {

  static async getCycle(groupName: string): Promise<Cicle | null> {
    try {
      const cicle = await prisma.cicle.findFirst({
        where: { group: { some: { name: groupName } }}, // Busca un ciclo que tenga un grupo con el nombre dado
        select: {
          id: true,
          name: true,
        },
      });
      return cicle;
    } catch (error) {
      console.error('Error al obtener el ID del ciclo:', error);
      throw error;
    }
  };

  static async getAll () {
    try {
      const result = await prisma.cicle.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  static async create (data:Cicle, studentId: Student["id"]) {
    const {
      name,
    } = data;
    try {
        const result = await prisma.cicle.create({
          data: {
            name: name,
          }
        });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static async delete(id: Cicle["id"]) {
    try {
      const result = await prisma.cicle.delete({
        where: { id }
      });
      return result;
    } catch (error) {
      throw error;
    }
  };
};