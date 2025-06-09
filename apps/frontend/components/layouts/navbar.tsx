import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../ModeToggle";

export const Navbar = () => {
  return (
    <header className="w-full border-b p-4 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-semibold">Task Manager</h1>
      <nav className="space-x-4">
        <Link href="/login">
          <Button variant="outline" className="cursor-pointer">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button className="cursor-pointer">Register</Button>
        </Link>

        <ModeToggle />
      </nav>
    </header>
  );
};
