"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanSearch, BookOpen, FileText, Settings } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    name: "New Scan",
    description: "Analyze a skin condition",
    href: "/detect",
    icon: ScanSearch,
    color: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  {
    name: "Disease Library",
    description: "Browse conditions",
    href: "/library",
    icon: BookOpen,
    color: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
  },
  {
    name: "View Reports",
    description: "Detection history",
    href: "/history",
    icon: FileText,
    color: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
  },
  {
    name: "Settings",
    description: "Configure API",
    href: "/settings",
    icon: Settings,
    color: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Button variant="ghost" className={`h-auto w-full flex-col items-start gap-2 p-4 ${action.color}`}>
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">{action.name}</p>
                  <p className="text-xs opacity-80">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
