import { Router } from "express";
import { showAllCycle, createCycle, deleteCycle } from "../controllers/cycle.controllers";
import { validatePost } from "../middlewares/post.middlewares";
import { pagination } from "../utils/pagination.server";
import { adminRole, userRole } from "../middlewares/role.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";

export const cycleRoute = Router();

cycleRoute.get("/cycles", showAllCycle)
cycleRoute.post("/cycle", authenticate, adminRole, createCycle)
cycleRoute.delete("/cycle/:id", authenticate, adminRole, deleteCycle)