"use client";

import { useTasks } from "@/hooks/useTasks";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tasks />
    </QueryClientProvider>
  );
}

function Tasks() {
  const { data: tasks, isLoading, error } = useTasks();

  // const handleTaskDeletion = async (id: number) => {
  //   try {
  //     await api.delete(`/tasks/${id}`);

  //     refetch();
  //     toast("Success", {
  //       description: "Task deleted successfully!",
  //     });
  //   } catch (err) {
  //     handleApiError(err);
  //   }
  // };

  if (error) return <div>Something went wrong. {error.message}</div>;

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          {/* <div className="flex items-center space-x-2">
            <UserNav />
          </div> */}
        </div>
        {tasks && tasks?.length > 0 && (
          <DataTable
            data={tasks.map((task) => ({
              ...task,
              id: String(task.id),
              description: task.description ?? "No description",
            }))}
            columns={columns}
            loading={isLoading}
          />
        )}
      </div>
    </>
  );
}
