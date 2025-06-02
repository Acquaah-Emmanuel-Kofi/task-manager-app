"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormData, taskSchema } from "@/schemas/taskSchema";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ITask } from "@/interfaces/tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);

  const { reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const handleTaskUpdation = async (updatedTask: TaskFormData) => {
    const taskId = (row.original as ITask).id;
    const { data } = await api.put(`/tasks/${taskId}`, {
      ...updatedTask,
      id: taskId,
    });
    return data.data;
  };

  const mutation = useMutation({
    mutationFn: handleTaskUpdation,
    onSuccess: () => {
      handleSuccessResponse();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSuccessResponse = () => {
    reset();
    setOpen(false);
    toast("Success", {
      description: "Task updated successfully!",
    });
  };

  return (
    <Fragment>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && setOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            initialValues={row.original as ITask}
            submitLabel="Update"
            onSubmit={async (data: TaskFormData) =>
              await mutation.mutateAsync(data)
            }
          />
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}
