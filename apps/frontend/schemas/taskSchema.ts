import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  due_date: z.date().optional(),
  status: z.enum(["pending", "in-progress", "completed", "expired"]).optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
