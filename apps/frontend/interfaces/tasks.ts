export type ITaskStatus = "pending" | "in-progress" | "completed";
export type ITaskPriority = "low" | "normal" | "high";

export interface ITask {
  id: number;
  user_id: number;
  title: string;
  description: string;
  due_date: string;
  status: ITaskStatus;
  priority: ITaskPriority;
  created_at: string;
}

export interface ITaskMeta {
  next: number | null;
  page: number;
  previous: number | null;
  total: number;
}

export interface ITaskResponse {
  data: ITask[];
  meta: ITaskMeta;
}
