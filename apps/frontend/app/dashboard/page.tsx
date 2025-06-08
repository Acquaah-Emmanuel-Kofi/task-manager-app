"use client";

import { useTasks } from "@/hooks/useTasks";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {isMounted && <Tasks />}
    </QueryClientProvider>
  );
}

function Tasks() {
  const { data: tasks, isLoading, error, refetch } = useTasks();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (error) return <div>Something went wrong. {error.message}</div>;

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks!
          </p>
        </div>
      </div>
      <DataTable data={tasks ?? []} columns={columns} loading={isLoading} />
    </div>
  );
}
