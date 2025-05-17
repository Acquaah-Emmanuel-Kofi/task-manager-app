import { NextFunction, Request, Response } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByFilter,
  getTaskCount,
} from "../models/taskModel";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator";
import { ITask } from "../interfaces/tasksInterface";
import { taskQuerySchema } from "../schemas/taskQuerySchema";

export const handleCreateTask = async (
  req: Request<ITask>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await createTask(data);
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

export const handleGetTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = taskQuerySchema.parse(req.query);

    const limit = validated.limit ?? 10;
    const offset = validated.offset ?? 0;
    const page = Math.floor(offset / limit) + 1;

    const [tasks, total] = await Promise.all([
      getTasksByFilter(validated),
      getTaskCount(validated),
    ]);

    res.json({
      meta: {
        total,
        page,
        limit,
        next: offset + limit < total ? page + 1 : null,
        previous: offset > 0 ? page - 1 : null,
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
    const id = Number(req.params.id);
    const updates = updateTaskSchema.parse(req.body);
    const task = await updateTask(id, updates);

    if (!task) {
      res.status(404).json({ error: "Task not found or no updates applied" });
    }

    res.json(task);
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
    const id = Number(req.params.id);
    const task = await deleteTask(id);

    if (!task) res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
