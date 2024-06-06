import { Router } from "express";
import { removeStudent, showAllStudent, showStudent, updateStudent } from "../controllers/student.controllers";
import { authenticate } from "../middlewares/auth.middlewares";
import { adminRole, userRole } from "../middlewares/role.middlewares";
import excelUpload from '../middlewares/excel.middlewares';


export const studentRoute = Router();

studentRoute.get("/student/:id", showStudent)
studentRoute.get("/students", showAllStudent)
studentRoute.put("/student/:id", authenticate, adminRole, updateStudent)
studentRoute.delete("/student/:id", authenticate, adminRole, removeStudent)