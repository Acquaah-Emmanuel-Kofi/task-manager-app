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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TaskMutationInput =
  | { type: "update"; task: TaskFormData; row: ITask }
  | { type: "delete"; id: number };

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const queryClient = useQueryClient();

  const [openDialog, setOpenDialog] = useState<"edit" | "delete" | null>(null);

  const { reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const handleTaskMutation = async (input: TaskMutationInput) => {
    if (input.type === "update") {
      const taskId = input.row.id;
      const { data } = await api.put(`/tasks/${taskId}`, {
        ...input.task,
        id: taskId,
      });
      return data.data;
    }

    if (input.type === "delete") {
      const { data } = await api.delete(`/tasks/${input.id}`);
      return data.data;
    }
  };

  const mutation = useMutation({
    mutationFn: handleTaskMutation,
    onSuccess: (_data, input) => {
      handleSuccessResponse(input.type);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSuccessResponse = (type: "update" | "delete") => {
    reset();
    setOpenDialog(null);
    toast("Success", {
      description: `Task ${
        type === "update" ? "updated" : "deleted"
      } successfully!`,
    });
  };

  return (
    <Fragment>
      <Dialog
        open={openDialog === "edit"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            initialValues={row.original as ITask}
            submitLabel="Update"
            onSubmit={async (updatedTask: TaskFormData) =>
              await mutation.mutateAsync({
                type: "update",
                row: row.original as ITask,
                task: updatedTask,
              })
            }
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={openDialog === "delete"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this task?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task will be permanently removed
              from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () =>
                await mutation.mutateAsync({
                  type: "delete",
                  id: (row.original as ITask).id,
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            onClick={() => setOpenDialog("edit")}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenDialog("delete")}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}
