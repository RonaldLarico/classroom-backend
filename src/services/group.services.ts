import { Cycle, Group, Student } from '@prisma/client';
import { prisma } from "../utils/prisma.server";


interface GroupCreationData {
  name: string;
  link?: string | undefined;
  cycleName: string;
}

export class groupService {

  static async getGroup (id: Group["id"]) {
    try {
      const result = await prisma.group.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          link: true,
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
          link: true,
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
        const { name, cycleName, link } = groupData;
        // Verificar si el ciclo asociado al grupo existe
        const existingCycle = await prisma.cycle.findFirst({
          where: {
            name: cycleName,
          },
        });
        if (!existingCycle) {
          // Si el ciclo no existe, maneja este caso apropiadamente
          console.error(`No se encontró el ciclo correspondiente para el grupo ${name}`);
          // Puedes lanzar un error, enviar una respuesta al usuario, o realizar alguna acción alternativa según tus requisitos
          continue; // Continuar con el siguiente grupo
        }
        // Verificar si el grupo ya existe
        const existingGroup = await prisma.group.findFirst({
          where: {
            cycleId: existingCycle.id,
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
              link,
              cycle: { connect: { id: existingCycle.id } },
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
      const result = await prisma.cycle.delete({
        where: { id }
      });
      return result;
    } catch (error) {
      throw error;
    }
  };
};