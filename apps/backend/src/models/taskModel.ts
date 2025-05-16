import pool from "../config/db";
import { ITask } from "../interfaces/tasksInterface";

export const createTask = async (task: ITask) => {
  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, due_date, status, priority)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      task.user_id,
      task.title,
      task.description,
      task.due_date,
      task.status,
      task.priority,
    ]
  );
  return result.rows[0];
};

export const getAllTasks = async () => {
  const result = await pool.query(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  );
  return result.rows;
};

export const getTaskById = async (id: number) => {
  const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
  return result.rows[0];
};

export const updateTask = async (id: number, updates: Partial<ITask>) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);

  if (fields.length === 0) return null;

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE tasks SET ${setClause} WHERE id = $${
      fields.length + 1
    } RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
};

export const deleteTask = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export const getTasksByFilter = async (filters: {
  status?: string;
  priority?: string;
}) => {
  const conditions: string[] = [];
  const values: any[] = [];

  if (filters.status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(filters.status);
  }

  if (filters.priority) {
    conditions.push(`priority = $${values.length + 1}`);
    values.push(filters.priority);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const query = `SELECT * FROM tasks ${where} ORDER BY created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};
