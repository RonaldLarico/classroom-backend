import { Router } from "express";
import { showAllGroup, showGroup, createGroup, deleteGroup } from "../controllers/group.controllers";
import { adminRole, userRole } from "../middlewares/role.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";
import excelUpload from "../middlewares/excel.middlewares";

export const groupRoute = Router();

groupRoute.get("/group/:id", showGroup)
groupRoute.get("/groups", showAllGroup)
groupRoute.post("/group", excelUpload, createGroup)
groupRoute.delete("/group/:id", deleteGroup)