"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTasks } from "@/hooks/useTasks";
import { useState } from "react";
import { toast } from "sonner";
import { TaskForm } from "./components/task-form";
import { hanldeApiError } from "@/lib/utils";
import { ITask } from "@/interfaces/tasks";
import { TaskFormData, taskSchema } from "@/schemas/taskSchema";

export default function DashboardPage() {
  const { tasks, loading, refetch } = useTasks();
  const [open, setOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const router = useRouter();

  const { reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const handleTaskCreation = async (data: TaskFormData) => {
    try {
      await api.post("/tasks", data);

      refetch();
      reset();
      setOpen(false);
      router.refresh();
      toast("Success", {
        description: "Task created successfully!",
      });
    } catch (err) {
      hanldeApiError(err);
    }
  };

  const handleTaskUpdation = async (task: Partial<ITask> & { id: number }) => {
    try {
      await api.put(`/tasks/${task.id}`, task);

      refetch();
      reset();
      setOpen(false);
      router.refresh();
      toast("Success", {
        description: "Task updated successfully!",
      });
    } catch (err) {
      hanldeApiError(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="cursor-pointer">
                + New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={handleTaskCreation} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog
        open={!!editingTask}
        onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              initialValues={editingTask}
              submitLabel="Update"
              onSubmit={handleTaskUpdation}
            />
          )}
        </DialogContent>
      </Dialog>

      {tasks.length === 0 ? (
        <p className="text-muted-foreground">
          {loading ? "Loading..." : "No tasks found"}
        </p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task: ITask) => (
            <Card
              key={task.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="font-medium">{task.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </div>

              <Badge
                className="pointer-events-none"
                variant={task.status === "completed" ? "default" : "outline"}
              >
                {task.status}
              </Badge>

              <Button
                onClick={() => setEditingTask(task)}
                className="cursor-pointer"
              >
                Edit
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
