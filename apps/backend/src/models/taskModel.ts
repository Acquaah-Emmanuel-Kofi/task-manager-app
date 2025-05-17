import pool from "../config/db";
import { ITask, ITaskFilters } from "../interfaces/tasksInterface";

export const createTask = async (task: ITask, userId: number) => {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, due_date, priority, user_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [task.title, task.description, task.due_date, task.priority, userId]
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

export const getTasksByFilter = async (
  filters: ITaskFilters,
  userId: number
) => {
  const conditions: string[] = ["user_id = $1"];
  const values: any[] = [userId];

  if (filters.status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(filters.status);
  }

  if (filters.priority) {
    conditions.push(`priority = $${values.length + 1}`);
    values.push(filters.priority);
  }

  if (filters.search) {
    conditions.push(`title ILIKE $${values.length + 1}`);
    values.push(`%${filters.search}%`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;
  const sortBy = filters.sort ?? "created_at";
  const sortOrder = filters.order === "asc" ? "ASC" : "DESC";
  const limit = filters.limit ?? 10;
  const offset = filters.offset ?? 0;

  const query = `
      SELECT * FROM tasks
      ${where}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
};

export const getTaskCount = async (
  filters: Partial<ITaskFilters>,
  userId: number
) => {
  const conditions: string[] = ["user_id = $1"];
  const values: any[] = [userId];

  if (filters.status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(filters.status);
  }

  if (filters.priority) {
    conditions.push(`priority = $${values.length + 1}`);
    values.push(filters.priority);
  }

  if (filters.search) {
    conditions.push(`title ILIKE $${values.length + 1}`);
    values.push(`%${filters.search}%`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;
  const query = `SELECT COUNT(*) FROM tasks ${where}`;
  const result = await pool.query(query, values);
  return parseInt(result.rows[0].count, 10);
};

export const markOverdueTasks = async () => {
  const result = await pool.query(`
      UPDATE tasks
      SET status = 'expired'
      WHERE due_date < NOW()
        AND status IN ('pending', 'in-progress')
        RETURNING id;
    `);

  return result.rowCount;
};
