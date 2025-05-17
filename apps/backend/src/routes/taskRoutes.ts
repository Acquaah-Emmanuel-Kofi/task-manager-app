import { Router } from "express";
import {
  handleCreateTask,
  handleGetTask,
  handleUpdateTask,
  handleDeleteTask,
  handleGetAllTasks,
} from "../controllers/taskController";
import { authenticate } from "../middlewares/authMiddleware";

const taskRoutes = Router();

// All routes require authentication
taskRoutes.use(authenticate);

taskRoutes.post("/", handleCreateTask);
taskRoutes.get("/", handleGetAllTasks);
taskRoutes.get("/:id", handleGetTask);
taskRoutes.put("/:id", handleUpdateTask);
taskRoutes.delete("/:id", handleDeleteTask);

export default taskRoutes;
