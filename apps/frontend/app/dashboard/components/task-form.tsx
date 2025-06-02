"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITask } from "@/interfaces/tasks";
import { TaskFormData, taskSchema } from "@/schemas/taskSchema";

type CreateTaskProps = {
  initialValues?: undefined;
  submitLabel?: string;
  onSubmit: (data: TaskFormData) => Promise<void>;
};

type EditTaskProps = {
  initialValues: ITask;
  submitLabel?: string;
  onSubmit: (data: TaskFormData & { id: number }) => Promise<void>;
};

type TaskFormProps = CreateTaskProps | EditTaskProps;

export function TaskForm(props: TaskFormProps) {
  const { initialValues, submitLabel = "Create" } = props;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "low",
      status: "pending",
      ...initialValues,
      due_date: initialValues?.due_date
        ? new Date(initialValues.due_date)
        : undefined,
    },
  });

  // Ensure the handler always matches the expected signature
  const handleFormSubmit = async (data: TaskFormData) => {
    if (
      "initialValues" in props &&
      props.initialValues &&
      "id" in props.initialValues
    ) {
      await (props as EditTaskProps).onSubmit({
        ...data,
        id: props.initialValues.id,
      });
    } else {
      await (props as CreateTaskProps).onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label className="mb-2">Title</Label>
        <Input {...register("title")} />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2">Description</Label>
        <Textarea {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-2 justify-between w-full">
        <div className="w-full">
          <Label className="mb-2">Due Date</Label>
          <Controller
            control={control}
            name="due_date"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>

        <div className="w-full">
          <Label className="mb-2">Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Button type="submit" className="cursor-pointer">
        {submitLabel}
      </Button>
    </form>
  );
}
