import { Prisma } from "@prisma/client";
import { authServices } from "../services/auth.services";
import { NextFunction, Request, Response } from "express";
import { userPick } from "../utils/format.server";

export const registerStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authServices.registerMultiple(req.body);
    if (!result) {
      next({
        errorDescription: "Unique constraint failed on the fields: (`email`)",
        status: 400,
        message: "Error, dirección de email ya existe",
        errorContent: "Unique constraint failed on the fields: (`email`)",
      });
    } else
      res.status(201).json(result);
  } catch (error:any) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2002") {
        next({
          errorDescription: error.meta?.target,
          status: 400,
          message: "Error: Email existente",
          errorContent: "Error: Duplicate email"
        });
      } else {
        res.status(400).json(error);
      }
    } else {
      res.status(400).json(error);
    }
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;
    const result = await authServices.login(body);
    if (result) {
      if (typeof result === 'number') {
        const tokenData: userPick = { id: result, user: "", password: "", role: "USER" };
        const token = authServices.getToken(tokenData);
        res.json({ id: result, token });
      } else {
        next({
          errorDescription: "Couldn't find user in records",
          status: 400,
          message: "No se pudo encontrar al usuario en los registros",
          errorContent: "Couldn't find user in records",
        });
      }
    } else {
      next({
        errorDescription: "Password don't match with user",
        status: 400,
        message: "La contraseña no coincide con el usuario",
        errorContent: "Password don't match with user",
      });
    }
  } catch (error: any) {
    console.log(error);
    next({
      errorDescription: error,
      status: 400,
      message: "Error, prisma client error, check logs",
      errorContent: error.clientVersion,
    });
  }
};
