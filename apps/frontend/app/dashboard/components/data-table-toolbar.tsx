"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "./data-table-view-options";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import { useState } from "react";
import api from "@/lib/axios";
import { useForm } from "react-hook-form";
import { TaskFormData, taskSchema } from "@/schemas/taskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const queryClient = useQueryClient();

  const isFiltered = table.getState().columnFilters.length > 0;
  const [open, setOpen] = useState<boolean>(false);

  const { reset } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const handleTaskCreation = async (newTask: TaskFormData) => {
    const { data } = await api.post("/tasks", newTask);
    return data.data;
  };

  const mutation = useMutation({
    mutationFn: handleTaskCreation,
    onSuccess: () => {
      handleSuccessResponse();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSuccessResponse = () => {
    reset();
    setOpen(false);
    toast("Success", {
      description: "Task created successfully!",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3 cursor-pointer"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            size="sm"
            className="ml-2 hidden h-8 lg:flex cursor-pointer"
          >
            + New Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={async (data: TaskFormData) =>
              await mutation.mutateAsync(data)
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
