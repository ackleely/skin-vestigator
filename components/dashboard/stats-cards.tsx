"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScanSearch, AlertTriangle, CheckCircle, ShieldCheck } from "lucide-react"

export function StatsCards() {
  const { detections } = useAppStore()

  const totalScans = detections.length
  const severeCount = detections.filter((d) => d.severity === "severe").length
  const healthyCount = detections.filter((d) => d.noDiseaseDetected || d.severity === "none").length
  const avgConfidence =
    detections.length > 0 ? Math.round(detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length) : 0

  const stats = [
    {
      name: "Total Scans",
      value: totalScans.toString(),
      icon: ScanSearch,
      description: "All-time detections",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Severe Cases",
      value: severeCount.toString(),
      icon: AlertTriangle,
      description: "Requiring attention",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      name: "Healthy Scans",
      value: healthyCount.toString(),
      icon: ShieldCheck,
      description: "No disease detected",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      name: "Avg. Confidence",
      value: `${avgConfidence}%`,
      icon: CheckCircle,
      description: "Detection accuracy",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
