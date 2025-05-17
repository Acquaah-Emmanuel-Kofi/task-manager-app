export type ITaskStatus = "pending" | "in-progress" | "completed";
export type ITaskPriority = "low" | "normal" | "high";

export interface ITask {
  user_id: number;
  title: string;
  description?: string;
  due_date?: string;
  status?: ITaskStatus;
  priority?: ITaskPriority;
}
