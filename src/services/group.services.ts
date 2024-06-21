import { Group } from '@prisma/client';
import { prisma } from "../utils/prisma.server";
interface GroupCreationData {
  groupName: string;
  fecha: string;
  link: string;
  cycleName: string;
}

export class groupService {

  static async getGroup (id: Group["id"]) {
    try {
      const result = await prisma.group.findUnique({
        where: { id },
        select: {
          id: true,
          fecha: true,
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
                  active: true,
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
          fecha: true,
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
                  active: true,
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
    const { groupName, fecha, link, cycleName } = data;
    console.log("cycleName en create group.services", cycleName)
    if (!cycleName) {
      throw new Error(`El nombre del ciclo no está definido`);
      }
    console.log("groupName", groupName)
      const cycles = await prisma.cycle.findMany({
          where: { name: { in: [cycleName]} }
      });
    if (!link) {
      throw new Error(`El enlace no está definido`);
    }
      if (!cycles || cycles.length === 0) {
          throw new Error(`No se encontró el ciclo con el nombre ${cycleName}`);
      }
      const existingGroup = await prisma.group.findFirst({
          where: {
              AND: [{ groupName }, { cycleId: { in: cycles.map(cycle => cycle.id)} }],
          },
      });
      if (existingGroup) {
          return existingGroup;
      }
      const newGroup = await prisma.group.create({
          data: {
            groupName,
            fecha,
            link,
            cycle: {
              connect: { id: cycles[0].id }
            }
          },
      });
      return newGroup;
  } catch (error) {
      console.error('Error al crear el grupo:', error);
      throw error;
  }
}

static async deleteGroupAndStudents(id: number) {
  try {
    const studentIdsToDelete = await prisma.studentOnGroups
      .findMany({
        where: {
          groupId: id
        }
      })
      .then((relations) => relations.map((relation) => relation.studentId));
    await prisma.studentOnGroups.deleteMany({
      where: {
        groupId: id
      }
    });
    const deleteStudentsPromise = studentIdsToDelete.map((studentId) =>
      prisma.student.delete({
        where: {
          id: studentId
        }
      })
    );
    await Promise.all(deleteStudentsPromise);
    const result = await prisma.group.delete({
      where: {
        id
      }
    });
    return result;
  } catch (error) {
    throw error;
  }
}
};