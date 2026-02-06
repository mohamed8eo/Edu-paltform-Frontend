"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { 
  User, 
  LogOut, 
  Settings, 
  BookOpen,
  Shield,
} from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const isProfilePage = pathname === "/profile";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isHomePage && user) {
      router.push("/home");
    }
  }, [mounted, isHomePage, user, router]);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full transition-all duration-300 bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Logo />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {isHomePage && <MobileMenu />}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#courses", label: "Courses" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {isHomePage && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ))}
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Auth Buttons (Home Page Only) */}
            {isHomePage && !user && !loading && (
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="hover:bg-primary/10"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-primary to-primary/90"
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu (Home Page Only) */}
            {isHomePage && <MobileMenu />}

            {/* User Avatar with Dropdown (Not on home/profile pages) */}
            {!isHomePage && !isProfilePage && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/40 transition-all"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.image || undefined}
                        alt={user.name || "User"}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          console.error("Failed to load avatar image:", user.image);
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold">
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 border-2 shadow-xl"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/my-courses" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>My Courses</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/admin" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => {
                      // Handle logout
                      router.push("/sign-out");
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Simple Avatar Link (Profile Page) */}
            {isProfilePage && user && (
              <Link href="/home">
                <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name || "User"}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      console.error("Failed to load avatar image:", user.image);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-sm font-semibold">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}