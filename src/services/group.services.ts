import { Cicle, Group, Student } from '@prisma/client';
import { prisma } from "../utils/prisma.server";


interface GroupCreationData {
  name: string;
  cicleId: number;
}

export class groupService {

  static async getGroup (id: Group["id"]) {
    try {
      const result = await prisma.group.findUnique({
        where: { id },
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

  static async getAllGroup () {
    try {
      const result = await prisma.group.findMany({
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

  static async create(data: GroupCreationData[]): Promise<(Group | null)[]> {
    const results: (Group | null)[] = [];
    try {
      for (const groupData of data) {
        const { name, cicleId } = groupData;
        // Verificar si el grupo ya existe
        const existingGroup = await prisma.group.findFirst({
          where: {
            cicleId,
            name, // Utiliza el nombre como filtro
          },
        });
        // Si el grupo ya existe, retornar el grupo existente
        if (existingGroup) {
          results.push(existingGroup);
        } else {
          // Si el grupo no existe, crear uno nuevo
          const result = await prisma.group.create({
            data: {
              name,
              cicle: { connect: { id: cicleId } }
            },
          });
          results.push(result);
        }
      }
      return results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async delete(id: Group["id"]) {
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