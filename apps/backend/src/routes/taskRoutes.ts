import { Router } from "express";
import {
  handleCreateTask,
  handleGetTasks,
  handleGetTask,
  handleUpdateTask,
  handleDeleteTask,
} from "../controllers/taskController";

const taskRoutes = Router();

taskRoutes.post("/tasks", handleCreateTask);
taskRoutes.get("/tasks", handleGetTasks);
taskRoutes.get("/tasks/:id", handleGetTask);
taskRoutes.put("/tasks/:id", handleUpdateTask);
taskRoutes.delete("/tasks/:id", handleDeleteTask);

export default taskRoutes;
