import { Cycle, Group, Student } from '@prisma/client';
import { prisma } from "../utils/prisma.server";
import { cycleService } from './cycle.services';


interface GroupCreationData {
  groupName: string;
  link?: string | undefined;
  cycleName?: string | undefined;
}

export class groupService {

  static async getGroup (id: Group["id"]) {
    try {
      const result = await prisma.group.findUnique({
        where: { id },
        select: {
          id: true,
          groupName: true,
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
          groupName: true,
          link: true,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Modifica la función create en tu servicio de grupos (group.services.ts)
static async create(data: GroupCreationData): Promise<Group | null> {
  try {
      const { groupName, link, cycleName } = data;

      // Busca el ciclo por su nombre
      const cycle = await prisma.cycle.findFirst({
          where: { name: cycleName }
      });

      if (!cycle) {
          throw new Error(`No se encontró el ciclo con el nombre ${cycleName}`);
      }

      // Verificar si el grupo ya existe
      const existingGroup = await prisma.group.findFirst({
          where: {
              groupName,
          },
      });

      // Si el grupo ya existe, retornar el grupo existente
      if (existingGroup) {
          console.log(`El grupo ${groupName} ya existe.`);
          return existingGroup;
      }
      // Si el grupo no existe, crear uno nuevo
      const newGroup = await prisma.group.create({
          data: {
              groupName,
              link,
              cycle: { connect: { id: cycle.id } }
          },
      });
      console.log(`Grupo ${groupName} creado correctamente.`);
      return newGroup;
  } catch (error) {
      console.error('Error al crear el grupo:', error);
      throw error;
  }
}


  static async delete(id: Group["id"]) {
    try {
      const result = await prisma.group.delete({
        where: { id }
      });
      return result;
    } catch (error) {
      throw error;
    }
  };
};