import { NextFunction, Request, Response } from "express";
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
      res.status(200).json(result);
    } else {
      next ({
        errorDescription: newId,
        status: 400,
        message: "Error: Invalid group",
        errorContent: "Error: Invalid group"
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
    const { name, cycleName, link } = req.body;
    const result = await groupService.create([{ name, cycleName, link }]);
    if (result) {
      res.status(201).json(result);
    } else {
      next({
        status: 400,
        message: 'Error al crear el grupo',
        errorContent: 'El resultado es undefiend',
      });
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const deleteGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const newId = parseInt(id)
    if (typeof newId === 'number' && newId >= 0) {
      const result = await groupService.delete(newId)
      res.status(200).json(result);
    } else {
      next({
        status: 400,
        message: "Error: Insert valid Id",
        errorContent: "Error: Invalid Id"
      })
    }
  } catch (error) {
    console.error(error);
  }
};