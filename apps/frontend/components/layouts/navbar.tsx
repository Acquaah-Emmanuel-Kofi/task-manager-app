"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../ModeToggle";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full border-b p-4 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-semibold">Task Manager</h1>
      <nav className="space-x-4">
        {isAuthenticated ? (
          <Button onClick={logout} className="cursor-pointer">
            Logout
          </Button>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline" className="cursor-pointer">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="cursor-pointer">Register</Button>
            </Link>
          </>
        )}
        <ModeToggle />
      </nav>
    </header>
  );
};
