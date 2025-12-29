"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ScanSearch,
  BookOpen,
  History,
  Settings,
  ActivitySquareIcon,
  Activity,
  Menu,
  Home,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Skin Detector", href: "/detect", icon: ScanSearch },
  { name: "Disease Library", href: "/library", icon: BookOpen },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function TopNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - updated for bold header */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 shadow-sm">
              <ActivitySquareIcon className="text-primary w-7 h-7" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">Skin-vestigator</h1>
              <p className="text-[10px] text-white/70 -mt-1">Common Skin Disease Analysis</p>
            </div>
          </Link>

          {/* Desktop Navigation - updated for bold header */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive ? "bg-white text-primary shadow-sm" : "text-white/80 hover:bg-white/15 hover:text-white",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
            {/* Exit to Welcome Button */}
            <Link
              href="/welcome"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all text-white/80 hover:bg-white/15 hover:text-white ml-2 border border-white/20"
            >
              <LogOut className="h-4 w-4" />
              Exit
            </Link>
          </nav>

          {/* Mobile Menu - updated button for bold header */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/15">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex items-center gap-2 mb-8">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Skin-vestigator</h1>
                  <p className="text-xs text-muted-foreground">AI Skin Analysis</p>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
                {/* Exit to Welcome Button - Mobile */}
                <Link
                  href="/welcome"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive mt-2 border border-border"
                >
                  <LogOut className="h-5 w-5" />
                  Exit to Welcome
                </Link>
              </nav>
              <div className="mt-8 rounded-lg bg-accent/10 border border-accent/20 p-4">
                <p className="text-xs font-semibold text-accent">Disclaimer</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  This tool is for educational purposes only. Always consult a healthcare professional.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
