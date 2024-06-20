import express from "express";
import cors from "cors";
import morgan from "morgan";
import { handleError } from "./middlewares/error.middlewares";
import { cycleRoute } from "./routes/cycle.routes";
import { groupRoute } from "./routes/group.routes";
import { authRoute } from "./routes/auth.routes";
import { studentRoute } from "./routes/student.routes";
import routerLink from './routes/encrypt.routes';

export const app = express();

//Development
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const prefix: string = "/api/v1";
//Routes
app.use(prefix, studentRoute);
app.use(prefix, cycleRoute);
app.use(prefix, groupRoute);
app.use(prefix, routerLink);
app.use(prefix, authRoute);

//Middleware Error
app.use(handleError);

export default app;
