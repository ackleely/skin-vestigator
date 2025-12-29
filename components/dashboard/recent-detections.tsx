"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function RecentDetections() {
  const { detections } = useAppStore()
  const recentDetections = detections.slice(0, 5)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "none":
        return "bg-success/10 text-success border-success/20"
      case "mild":
        return "bg-success/10 text-success border-success/20"
      case "moderate":
        return "bg-warning/10 text-warning-foreground border-warning/20"
      case "severe":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getSeverityLabel = (severity: string, noDiseaseDetected?: boolean) => {
    if (noDiseaseDetected || severity === "none") {
      return "Healthy"
    }
    return severity
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Detections</CardTitle>
        <Link href="/history">
          <Button variant="ghost" size="sm" className="gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentDetections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-secondary p-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">No detections yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Start by scanning a skin condition</p>
            <Link href="/detect" className="mt-4">
              <Button size="sm">Start Detection</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentDetections.map((detection) => (
              <div
                key={detection.id}
                className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={detection.imageSrc || "/placeholder.svg"}
                    alt={detection.disease}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{detection.disease}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(detection.timestamp)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getSeverityColor(detection.severity)}>
                    {getSeverityLabel(detection.severity, detection.noDiseaseDetected)}
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">{detection.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
