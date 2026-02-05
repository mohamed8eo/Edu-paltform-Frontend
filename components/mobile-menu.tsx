"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const menuItems = [
    { href: "#about", label: "About", icon: "📖" },
    { href: "#features", label: "Features", icon: "✨" },
    { href: "#courses", label: "Courses", icon: "🎓" },
    { href: "#contact", label: "Contact", icon: "📧" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative group hover:bg-primary/10"
        >
          <Menu className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[320px] sm:w-[380px] border-l-2 bg-background/98 backdrop-blur-xl"
      >
        {/* Header */}
        <SheetHeader className="border-b pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
              <SheetDescription className="text-xs">
                Navigate through the website
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Navigation Links */}
        {isHomePage && (
          <nav className="flex flex-col gap-2 mb-8">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="group relative flex items-center gap-3 text-base font-medium hover:text-primary transition-all py-4 px-4 rounded-xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>
        )}

        {/* Auth Buttons */}
        {isHomePage && (
          <div className="space-y-3 pt-6 border-t-2">
            <Button
              variant="outline"
              className="w-full h-12 text-base font-medium border-2 hover:bg-primary/5 hover:border-primary/30"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button
              className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href="/sign-up">
                Get Started
                <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {/* Footer Info */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground text-center">
              © 2024 Your Platform. All rights reserved.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}