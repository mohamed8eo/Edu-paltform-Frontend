"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const menuItems = [
    { href: "#about", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#courses", label: "Courses" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Navigate to different sections of the website</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-8">
          {isHomePage && menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-base font-medium hover:text-primary hover:bg-primary/5 transition-all py-3 px-4 rounded-lg border-b border-border/50 last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 mt-8 pt-6 border-t border-border">
          {isHomePage && (
            <>
              <Button variant="outline" className="w-full bg-transparent" asChild onClick={() => setOpen(false)}>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button className="w-full" asChild onClick={() => setOpen(false)}>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
