import { NextFunction, Request, Response } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByFilter,
  getTaskCount,
  markOverdueTasks,
} from "../models/taskModel";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator";
import { taskQuerySchema } from "../schemas/taskQuerySchema";

export const handleCreateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedPayload = createTaskSchema.parse(req.body);
    const userId = (req as any).user.userId;

    const task = await createTask(validatedPayload, userId);

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// export const handleGetTasks = async (
//   _req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const tasks = await getAllTasks();
//     res.json(tasks);
//   } catch (err) {
//     next(err);
//   }
// };

export const handleGetTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const task = await getTaskById(id);

    if (!task) res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const handleGetAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await markOverdueTasks();

    const userId = (req as any).user.userId;
    const validated = taskQuerySchema.parse(req.query);

    const page = validated.page ?? 1;
    const limit = validated.limit ?? 10;
    const offset = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      getTasksByFilter({ ...validated, limit, offset }, userId),
      getTaskCount(validated, userId),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      meta: {
        total,
        page,
        next: page < totalPages ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
      },
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

export const handleUpdateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const userId = (req as any).user.userId;

    const task = await getTaskById(id);

    if (!task) res.status(404).json({ message: "Task not found" });

    if (task.user_id !== userId) {
      res.status(403).json({ message: "Not authorized" });
    }

    const validated = updateTaskSchema.parse(req.body);
    const updated = await updateTask(id, validated);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const handleDeleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const userId = (req as any).user.userId;

    const task = await getTaskById(id);

    if (!task) res.status(404).json({ message: "Task not found" });

    if (task.user_id !== userId) {
      res.status(403).json({ message: "Not authorized" });
    }

    await deleteTask(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
