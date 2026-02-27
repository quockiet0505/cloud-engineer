import { Router } from "express";
import {
  createTaskHandler,
  getTasksHandler,
  deleteTaskHandler 
} from "../controllers/task.controller.js";

const router = Router();

router.post("/", createTaskHandler);
router.get("/", getTasksHandler);
router.delete("/:id", deleteTaskHandler); 

export default router;