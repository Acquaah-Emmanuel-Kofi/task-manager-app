import { AppSidebar } from "@/components/layouts/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
