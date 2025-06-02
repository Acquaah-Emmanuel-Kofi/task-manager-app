import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  due_date: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
