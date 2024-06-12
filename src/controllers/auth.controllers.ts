import { authServices } from "../services/auth.services";
import { NextFunction, Request, Response } from "express";
import { UserData, userPick } from "../utils/format.server";
import studentServices from "../services/student.services";

export const registerStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let usersData: UserData[] = Array.isArray(req.body) ? req.body : [req.body];
    console.log("userData", usersData);
    console.log("req.body:", req.body);
     // Asegurémonos de que usersData sea un array de objetos UserData válidos
    usersData = usersData.filter(userData =>
      userData && typeof userData === 'object' &&
      (userData.name || userData.password || userData.role || userData.user)
    );

    console.log("userData después de la limpieza:", usersData);
    const result = await authServices.registerMultiple(usersData);
    if (!result) {
      next({
        errorDescription: "Unique constraint failed on the fields: (`email`)",
        status: 400,
        message: "Error, dirección de email ya existe",
        errorContent: "Unique constraint failed on the fields: (`email`)",
      });
    } else {
      res.status(201).json(result);}
  } catch (error:any) {
    console.log(error);
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
       // Obtén la información del estudiante correspondiente al ID devuelto
        const student = await studentServices.getStudent(result);
        if (student) {
          // Si se encontró al estudiante, responde con el token y los datos del estudiante
          res.json({ id: result, token, student });
        } else {
          // Si no se encontró al estudiante, maneja el error apropiadamente
          next({
            errorDescription: "Couldn't find user in records",
            status: 400,
            message: "No se pudo encontrar al usuario",
            errorContent: "Couldn't find user in records",
          });
        }
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
        message: "El usuario o contraseña no coinciden",
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
