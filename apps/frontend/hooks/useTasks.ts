import { ITask, ITaskResponse } from "@/interfaces/tasks";
import api from "@/lib/axios";
import { ApiResponse } from "@/interfaces/common";
import { useQuery } from "@tanstack/react-query";

export const useTasks = () => {
  return useQuery<ITask[], Error>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data }: ApiResponse<ITaskResponse> = await api.get("/tasks");
      return data.data;
    },
  });
};
