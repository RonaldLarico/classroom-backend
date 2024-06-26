import { NextFunction, Request, Response } from "express";
import { Prisma } from "../utils/prisma.server";
import { studentServices } from "../services/student.services";
import { paginationInfo } from "../utils/format.server";

export const showStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const convertId = parseInt(id);
    if (typeof convertId === "number" && convertId >= 0) {
      const result = await studentServices.getStudent(convertId);
      if (result) {
        res.status(200).json(result);
      } else {
        next({
          status: 400,
          message: "ID no registrado del estudiante",
          errorContent: "Student not found",
        });
      }
    } else {
      next({
        status: 400,
        message: "Ingresar ID correcto",
        errorContent: "ID student not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export const showAllStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { limit, offset } = res.locals as paginationInfo;
      const result = await studentServices.getAllStudent(limit, offset);
      res.status(200).json(result);
    } catch (error) {
      next({
        errorDescription: error,
        status: 404,
        message: "No se pudo encontrar los registros",
        errorContent: "Could'n find users records",
      });
    }
  };

  export const showAllAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await studentServices.getAllAdmin();
      res.status(200).json(result);
    } catch (error) {
      next({
        errorDescription: error,
        status: 404,
        message: "No se pudo encontrar los registros",
        errorContent: "Could'n find users records",
      });
    }
  };

  export const updateStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const convertId = parseInt(id);
      if (typeof convertId !== "number" || convertId < 0) {
        return next({
          status: 400,
          message: "Invalid Id",
          errorContent: "Insert a valid Id",
        });
      }
      if (!data || data.role === undefined) {
        return next({
          status: 400,
          message: "Invalid data. Role is missing.",
          errorContent: "Role is required for the update.",
        });
      }
      const result = await studentServices.updateUser(data, convertId)
      res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
      } else {
        res.status(500).json({ error: "Error desconocido al actualizar el usuario." });
      }
    }
  };

  export const removeStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const convertId = parseInt(id);
      if (typeof convertId === "number" && convertId >= 0) {
        const result = await studentServices.delete(convertId);
        res.status(200).json({ id: result.id });
      } else {
        next({
          errorDescription: convertId,
          status: 400,
          message: "Error, ingrese un id valido!",
          errorContent: "Error, invalid id for user",
        });
      }
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == "P2025") {
          next({
            errorDescription: error,
            status: 400,
            message: "Error, ID de estudiante no encontrado en los registros",
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

  export const deleteAllStudents = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await studentServices.deleteMany();
      res.status(200).json({
        message: "All students deleted successfully", result
      });
    } catch (error: any) {
      next({
        errorDescription: error,
        status: 400,
        message: "Error deleting all students",
        errorContent: error.message,
      })
    }
  }