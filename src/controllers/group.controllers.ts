import { NextFunction, Request, Response } from "express";
import { Prisma } from "../utils/prisma.server";
import { groupService } from "../services/group.services";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const showGroup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } =req.params;
    const newId = parseInt(id);
    if (typeof newId === "number" && newId >=0 ) {
      const result = await groupService.getGroup(newId);
      if(result) {
        res.status(200).json(result);
      } else {
        next ({
          errorDescription: newId,
          status: 400,
          message: "Error: ID no registrado del grupo",
          errorContent: "Error: Group not found"
        })
      }
    } else {
      next ({
        errorDescription: newId,
        status: 400,
        message: "Error: ID invalido del grupo",
        errorContent: "Error: Invalid ID the group"
      })
    }
  } catch (error: PrismaClientKnownRequestError | any) {
    console.error(error);
    next ({
      errorDescription: error,
      status: 400,
      message: "Error: invalid group",
      errorContent:error.clientVersion
    });
  }
};

export const showAllGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await groupService.getAllGroup()
    res.status(200).json(result);
  } catch (error) {
    next({
      errorDescription: error,
      status: 400,
      message: "Error: invalid group",
      errorContent: "Group not found"
    });
  }
};

export const createGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupName, link, cycleName } = req.body;
    // Si cycleName no está definido, devuelve un error
    if (cycleName === undefined || cycleName === "") {
      return next({
        status: 400,
        message: 'El nombre del ciclo no está definidottttt',
        errorContent: 'El nombre del ciclo es requeridottttttttt',
      });
    }
    const result = await groupService.create({ groupName, link, cycleName });
    if (result) {
      res.status(201).json(result);
    } else {
      next({
        status: 400,
        message: 'Error al crear el grupo',
        errorContent: 'El resultado es undefined',
      });
    }
  } catch (error: any) {
    console.error('Error en el controlador createGroup:', error);
    next({
      status: 500,
      message: 'Error interno del servidor',
      errorContent: error.message,
    });
  }
};



export const deleteGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const newId = parseInt(id, 10)
    if (typeof newId === 'number' && newId >= 0) {
      const result = await groupService.deleteGroupAndStudents(newId)
      res.status(200).json(result);
    } else {
      next({
        status: 400,
        message: "Error: ID invalido del grupo",
        errorContent: "Error: ID not found",
      })
    }
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2025") {
        next({
          errorDescription: error,
          status: 400,
          message: "Error, ID de grupo no encontrado en los registros",
          errorContent: error.meta?.cause,
        });
      }
    } else {
      next({
        errorDescription: error,
        status: 400,
        message: "Error, prisma client error, check logs",
        errorContent: error.clientVersion,
      });
    }
  }
};