import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

export interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

dotenv.config();
const secret = process.env.ACCESS_TOKEN_SECRET;

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({
        message: "Necesita iniciar sesión para ver la información",
        errorContent: "Need to log in to see the information",
      });
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Token de autenticación no proporcionado",
        errorContent: "Authentication token not provided",
      });
    }
    if (secret && token) {
      const decodedToken = jwt.verify(token, secret, { algorithms: ["HS256"] }) as { id: number };
      req.user = { id: decodedToken.id }; // Establece req.user con la información del token
      next();
    } else {
      return res.status(401).json({
        message: "Token de autenticación inválido",
        errorContent: "Invalid authentication token",
      });
    }
  } catch (error: any) {
    console.error("Error en el middleware de autenticación:", error);
    return res.status(401).json({
      message: "Error de autenticación",
      errorContent: error.message,
    });
  }
};

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstName,
    lastName,
    password,
    phone,
  } = req.body;

  if (typeof firstName !== "string" || firstName.length <= 0) {
    res.status(400).json({
      error: `Value '${firstName}' not set to firstName`
    });
  } else if (typeof password !== "string") {
    res.status(400).json({
      error: `Value '${password}' not set to password`
    });
  } else if (typeof lastName !== "string" || lastName.length <= 0) {
    res.status(400).json({
      error: `Value '${lastName}' not set to lastName`
    });
  } else if (typeof phone !== "number") {
    res.status(400).json({
      error: `Value '${phone}' not set to phone`
    });
  } else {
    next();
  }
};