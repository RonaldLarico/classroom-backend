import { Response, Request, NextFunction } from "express";
import { userInfo } from "../utils/format.server";

export const adminRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInfo = res.locals.userInfo as userInfo;

  // Permitir a usuarios con roles "ADMIN" o "USER"
  if (userInfo.role === "ADMIN") {
    next();
  } else {
    res.status(400).json({
      message: "Error, you do not have access for this route",
      error: "Check the role with your admin",
      mensage: "Error, no tienes acceso para esta ruta",
      status: false,
    });
  }
};

export const userRole = (
    req:Request,
    res:Response,
    next:NextFunction
  ) => {
    const { role } = res.locals.userInfo as userInfo;
    if (role == "USER" || role == "ADMIN") {
      next();
    } else {
      res.status(400).json ({
          message: "error, you do not have access for this route",
          error: "Check the role with your admin",
          mensage: "error, no tienes acceso para esta ruta",
          status: false,
      });
    }
  };

  export const historyRole = (
    req:Request,
    res:Response,
    next:NextFunction
  ) => {
    const { role } = res.locals.userInfo as userInfo;
    if (role == "ADMIN" || role == "USER") {
      next();
    } else {
      res.status(400).json ({
          message: "error, you do not have access for this route",
          error: "Check the role with your admin",
          mensage: "error, no tienes acceso para esta ruta",
          status: false,
      });
    }
  };