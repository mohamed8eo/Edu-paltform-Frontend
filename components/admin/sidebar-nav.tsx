"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Users, Folder, BookOpen, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const adminNav = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Folder,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      {/* Return to Home Button */}
      <Link href="/home">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 border-2 hover:bg-primary/10 hover:border-primary/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Button>
      </Link>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Admin Navigation */}
      <div className="space-y-1">
        {adminNav.map((item) => {
          const Icon = item.icon;
          // Dashboard is active only on exact /admin route
          const isDashboardActive = pathname === item.href;
          // Other nav items are active on their exact route or sub-routes
          const isOtherActive =
            pathname.startsWith(`${item.href}/`) || pathname === item.href;
          const isActive =
            item.href === "/admin" ? isDashboardActive : isOtherActive;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="w-4 h-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}