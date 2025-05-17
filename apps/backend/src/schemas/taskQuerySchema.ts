import { z } from "zod";

export const taskQuerySchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.enum(["created_at", "due_date", "priority"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});
