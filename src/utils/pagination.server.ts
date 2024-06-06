import { Request, Response, NextFunction } from "express";

export const pagination = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let { limit, offset } = req.query;
    if (
      typeof limit !== "string" ||
      limit.length <= 0 ||
      typeof offset !== "string" ||
      offset.length <= 0
    ) {
      res
        .status(400)
        .json({ error: "Error, no value not accepted or does not exist" });
    } else {
      const parseLimit = parseInt(limit, 10);
      const parseOffset = parseInt(offset, 10);
      if (
        typeof parseLimit === "number" &&
        parseLimit >= 1 &&
        typeof parseOffset === "number" &&
        parseOffset >= 0
      ) {
        res.locals.limit = parseLimit;
        res.locals.offset = parseOffset;
        next();
      } else {
        res.status(400).json({
          error: `Value ' ${offset} ' and  ' ${limit} ' is not set in newOffset / newLimit`,
        });
      }
    }
  };