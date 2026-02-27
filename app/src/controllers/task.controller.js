import { addTask, listTasks, removeTask } from "../services/task.service.js";

export const createTaskHandler = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await addTask(title);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTasksHandler = async (req, res) => {
  try {
    const tasks = await listTasks();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTaskHandler = async (req, res) => {
     try {
       const { id } = req.params;
       const deletedTask = await removeTask(id);
       if (!deletedTask) return res.status(404).json({ error: "Task not found" });
       
       res.json({ message: "Deleted successfully", task: deletedTask });
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   };