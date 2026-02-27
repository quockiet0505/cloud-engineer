import express from "express";
import healthRouter from "./routes/health.route.js";
import taskRouter from "./routes/task.route.js";
import viewRouter from "./routes/view.route.js";
import { initDB } from "./config/db.js";

const app = express();

app.use(express.json());

initDB(); 

app.use("/", viewRouter);
app.use("/health", healthRouter);
app.use("/tasks", taskRouter);

export default app;