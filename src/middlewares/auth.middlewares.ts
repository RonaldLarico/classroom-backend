import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const secret = process.env.ACCESS_TOKEN_SECRET;

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = req.headers.authorization;
    const token = result?.split(" ")[1];
    if (secret && token) {
      const decodedToken = jwt.verify(token, secret, { algorithms: ["HS256"] });
      res.locals.userInfo = decodedToken;
      next();
    } else {
      res.status(400).json({
        message: "Necesita iniciar sesión para ver la información",
        errorContent: "Need to log in to see the information",
      });
    }
  } catch (error) {
    res.status(400).json({ error });
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