import { Request, Response, NextFunction } from "express";

export const validatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description} = req.body;

  if (typeof title !== "string" || title.length <= 0) {
    res.status(400).json({
      error: `Value '${title}' not set to title`
    });
  } else if (typeof description !== "string" || description.length <= 0) {
    res.status(400).json({
      error: `Value '${description}' not set to description`
    });
  } else {
    next();
  }
};