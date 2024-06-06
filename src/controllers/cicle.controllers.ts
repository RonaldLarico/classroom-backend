import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { cycleService } from "../services/cycle.services";

export const showCycle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { groupName, id } = req.params;
    const newId = parseInt(id);
    if ( typeof newId === "number" && newId >= 0) {
      const result = await cycleService.getCycle(groupName);
      if (result) {
        res.status(200).send(result)
      } else {
        next({
          errorDescription: result,
          status: 400,
          message: 'Error: No se encontro el Id',
          errorContent:'Error: could not find  Id'
        })
      }
    } else {
      next({
        errorDescription: newId,
        status: 400,
        message:'Error: Id inexistent',
        errorContent: 'Error: Insert Id existent'
      })
    }
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.log(error);
    next({
      errorDescription: error,
      status: 400,
      message:'Error: invalid Id',
      errorContent:error.clientVersion
    });
  }
};

export const showAllCycle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await cycleService.getAll()
    res.status(200).json(result);
  } catch (error) {
      next({
        errorDescription: error,
        status: 400,
        message: "Error: No se pudo mostrar la lista de cycle ",
        errorContent: "Error: Could not display post list"
      });
  }
};

export const createCycle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { body } = req;
      console.log(req);
      const { studentId } = body;
      const result = await cycleService.create(body, studentId);
      if (result) {
        res.status(201).json(result)
      } else {
        next({
          status: 500,
          message: 'Error al crear el post',
          errorContent: 'El resultado es undefiend',
        });
      }
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(error);
        if (error.code == "P2025") {
          next({
            errorDescription: error,
            status: 400,
            message: "Error: User id not existing",
            errorContent: error.meta?.cause
          });
        }
      } else {
        next({
          errorDescription: error,
          status: 400,
          message: "Error: User id invalid",
          errorContent: error.clientVersion
        });
      }
    }
  };

export const deleteCycle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params
      const newId = parseInt(id)
      if (typeof newId === 'number' && newId >= 0) {
        const result = await cycleService.delete(newId)
        res.status(200).json(result)
      } else {
        next({
          status: 400,
          message: "Error: Insert valid Id",
          errorContent: "Error: Invalid Id"
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          next({
            status: 400,
            message: 'Error: not exist Id',
            errorContent: error.meta?.cause
          })
        } else if (error.code == 'P2009') {
          next({
            status: 400,
            message: 'Error: Id inexistent',
            errorContent: error.meta?.query_validation_error
          })
        } else {
          res.status(400).json(error);
        }
      } else {
        next({
          status: 400,
          message: "Error: Insert correct Id",
          errorContent: error.clientVersion
        })
      }
    }
  };