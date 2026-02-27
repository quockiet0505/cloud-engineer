import { createTask, getTasks, deleteTask } from "../models/task.model.js";

export const addTask = async (title) => await createTask(title);
export const listTasks = async () => await getTasks();
export const removeTask = async (id) => await deleteTask(id); 