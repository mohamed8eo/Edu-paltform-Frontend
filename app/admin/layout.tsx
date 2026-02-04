import React from "react";
import { AdminSidebarNav } from "@/components/admin/sidebar-nav";
export const metadata = {
  title: "Admin Dashboard",
  description: "Manage courses, categories, and users",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] flex-1">
        {/* Sidebar */}
        <div className="border-r bg-muted/30 p-6 overflow-y-auto">
          <div className="mb-8 sticky top-0">
            <h2 className="text-lg font-bold">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">
              Manage your platform
            </p>
          </div>
          <AdminSidebarNav />
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
