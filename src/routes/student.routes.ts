import { Router } from "express";
import { removeStudent, showAllAdmin, showAllStudent, showStudent, updateStudent } from "../controllers/student.controllers";
import { authenticate } from "../middlewares/auth.middlewares";
import { adminRole, userRole } from "../middlewares/role.middlewares";

export const studentRoute = Router();

studentRoute.get("/student/:id",authenticate, showStudent)
studentRoute.get("/students",authenticate, showAllStudent)
studentRoute.get("/admin",authenticate, showAllAdmin)
studentRoute.put("/student/:id", authenticate, adminRole, updateStudent)
studentRoute.delete("/student/:id", removeStudent)