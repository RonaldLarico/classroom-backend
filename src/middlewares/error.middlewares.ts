import { Response, Request, NextFunction } from "express";
import { errorProp } from "../utils/format.server";
import { prisma } from "../utils/prisma.server";

export const handleError = async (
  error: errorProp,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status, message, errorContent, errorDescription } = error;
  const convertError: string = errorDescription?.toString();
  const statusCode = typeof status === 'number' && !isNaN(status) ? status : 500;

  await prisma.logs.create({
    data: {
      errorDescription: convertError || "",
      message,
      errorContent,
    },
  });
  res.status(statusCode).json({ message, errorContent });
};