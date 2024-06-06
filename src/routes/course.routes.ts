/* import { Router } from "express";
import {
  showStudent,
  showAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  createAllStudent
} from "../controllers/courses.controllers";
import { validateCreateStudents, validateUpdateStudent } from "../middlewares/student.middlewares";
import { imageUpload } from "../middlewares/certificate.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";
import { userRole } from "../middlewares/role.middlewares";
import { adminRole } from "../middlewares/role.middlewares";
import { pagination } from "../utils/pagination.server";
import excelUpload from '../middlewares/excel.middlewares';

export const studentRoute = Router();

studentRoute.get("/show/student/:id", authenticate, userRole, showStudent)
studentRoute.get("/students",authenticate, showAllStudents)
studentRoute.post("/student",authenticate, userRole, imageUpload, validateCreateStudents, createStudent)
studentRoute.post("/students/many",authenticate, userRole, excelUpload, createAllStudent, (req, res) => {
  res.json({ message: 'Archivo Excel procesado correctamente'})
})
studentRoute.put("/student/:id",authenticate, userRole, imageUpload, validateUpdateStudent, updateStudent)
studentRoute.delete("/delete/student/:id",authenticate, userRole, deleteStudent) */