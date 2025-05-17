import { z } from "zod";

export const taskQuerySchema = z.object({
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  page: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive())
    .optional(),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive())
    .optional(),
  sort: z.enum(["created_at", "due_date", "priority"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  search: z.string().min(1).max(100).optional(),
});
