import { Router } from "express";
import { showAllCycle, createCycle, deleteCycle, showCycle } from "../controllers/cycle.controllers";
import { adminRole } from "../middlewares/role.middlewares";
import { authenticate } from "../middlewares/auth.middlewares";

export const cycleRoute = Router();

cycleRoute.get("/cycle/:id", showCycle)
cycleRoute.get("/cycles", showAllCycle)
cycleRoute.post("/cycle", createCycle)
cycleRoute.delete("/cycle/:id", authenticate, adminRole, deleteCycle)