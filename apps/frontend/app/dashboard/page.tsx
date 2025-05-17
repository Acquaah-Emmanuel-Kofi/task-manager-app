"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return router.push("/login");

    api
      .get("/tasks")
      .then((res) => setTasks(res.data.data))
      .catch((err) => {
        console.error(err);
        router.push("/login");
      });
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <Button
          onClick={() => {
            Cookies.remove("token");
            router.push("/login");
          }}
        >
          Logout
        </Button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-muted-foreground">No tasks found.</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
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
              <Badge variant={task.completed ? "default" : "outline"}>
                {task.completed ? "Done" : "Pending"}
              </Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
