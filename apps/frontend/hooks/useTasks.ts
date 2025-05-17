"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hanldeApiError } from "@/lib/utils";
import { ITask, ITaskResponse } from "@/interfaces/tasks";
import api from "@/lib/axios";
import { ApiResponse } from "@/interfaces/common";

export function useTasks() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data }: ApiResponse<ITaskResponse> = await api.get("/tasks");
      setTasks(data.data);
    } catch (err: unknown) {
      setError("Failed to fetch tasks");
      hanldeApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [router]);

  return { tasks, loading, error, refetch: fetchTasks };
}
