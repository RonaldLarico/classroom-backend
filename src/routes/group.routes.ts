import { Router } from "express";
import { showAllGroup, showGroup, createGroup, deleteGroup } from "../controllers/group.controllers";
import { adminRole } from "../middlewares/role.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";
import excelUpload from "../middlewares/excel.middlewares";

export const groupRoute = Router();

groupRoute.get("/group/:id",authenticate, showGroup)
groupRoute.get("/groups",authenticate, showAllGroup)
groupRoute.post("/group", excelUpload, createGroup)
groupRoute.delete("/group/:id", deleteGroup)