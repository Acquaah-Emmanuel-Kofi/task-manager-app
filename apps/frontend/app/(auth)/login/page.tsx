"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/lib/utils";
import { Icons } from "@/lib/icons";
import { useLayoutEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const registerSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useLayoutEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return null;

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      const { data } = await api.post("/auth/login", values);

      toast("Success", {
        description: "Login successful!",
      });
      Cookies.set("token", data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
