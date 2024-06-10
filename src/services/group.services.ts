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
          cycle: {
            select: {
              name: true,
            }
          },
          students: {
            include: {
              student: {
                select: {
                  name: true,
                  user: true,
                  role: true,
                }
              }
            }
          }
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
          cycle: {
            select: {
              name: true,
            }
          },
          students: {
            include: {
              student: {
                select: {
                  name: true,
                  user: true,
                  role: true,
                }
              }
            }
          }
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

static async create(data: GroupCreationData): Promise<Group | null> {
  try {
      const { groupName, link, cycleName } = data;
      if (!cycleName) {
        throw new Error(`El nombre del ciclo no está definido`);
    }
      const cycles = await prisma.cycle.findMany({
          where: { name: { in: [cycleName]} }
      });

      if (!cycles || cycles.length === 0) {
          throw new Error(`No se encontró el ciclo con el nombre ${cycleName}`);
      }
      const existingGroup = await prisma.group.findFirst({
          where: {
              AND: [{ groupName }, { cycleId: { in: cycles.map(cycle => cycle.id)} }],
          },
      });
      if (existingGroup) {
          console.log(`El grupo ${groupName} ya existe.`);
          return existingGroup;
      }
      const newGroup = await prisma.group.create({
          data: {
            groupName,
            link,
            cycle: {
              connect: { id: cycles[0].id }
            }
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