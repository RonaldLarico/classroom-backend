import { Router } from "express";
import { registerStudent, loginUser, registerUser } from "../controllers/auth.controllers";
import { adminRole } from "../middlewares/role.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";
import excelUpload  from "../middlewares/excel.middlewares"

export const authRoute = Router();

authRoute.post("/student/register", authenticate, excelUpload, registerStudent);
authRoute.post("/user/create",authenticate, registerUser);
authRoute.post("/student/login", loginUser);
