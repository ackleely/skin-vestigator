"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAppStore, type Detection } from "@/lib/store"
import { Search, Trash2, Eye, Calendar, Clock, StickyNote, AlertTriangle } from "lucide-react"
import Image from "next/image"

export default function HistoryPage() {
  const { detections, removeDetection, clearHistory, updateDetectionNotes } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [notes, setNotes] = useState("")

  const filteredDetections = detections.filter((d) => d.disease.toLowerCase().includes(searchQuery.toLowerCase()))

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
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleViewDetails = (detection: Detection) => {
    setSelectedDetection(detection)
    setNotes(detection.notes || "")
  }

  const handleSaveNotes = () => {
    if (selectedDetection) {
      updateDetectionNotes(selectedDetection.id, notes)
      setSelectedDetection(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Detection History</h1>
              <p className="mt-1 text-muted-foreground">View and manage your past skin analysis results</p>
            </div>
            {detections.length > 0 && (
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:text-destructive bg-transparent"
                onClick={() => setShowClearDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Search */}
          {detections.length > 0 && (
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by condition name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* Empty State */}
          {detections.length === 0 && (
            <Card className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-secondary p-6">
                <Clock className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">No Detection History</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
                Your skin analysis results will appear here. Start by analyzing a skin condition.
              </p>
              <Button className="mt-4" asChild>
                <a href="/detect">Start Detection</a>
              </Button>
            </Card>
          )}

          {/* Detection List */}
          {filteredDetections.length > 0 && (
            <div className="space-y-4">
              {filteredDetections.map((detection) => (
                <Card key={detection.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative h-48 sm:h-auto sm:w-48 shrink-0">
                        <Image
                          src={detection.imageSrc || "/placeholder.svg"}
                          alt={detection.disease}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{detection.disease}</h3>
                              <Badge variant="outline" className={getSeverityColor(detection.severity)}>
                                {getSeverityLabel(detection.severity, detection.noDiseaseDetected)}
                              </Badge>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(detection.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(detection.timestamp)}
                              </span>
                              <span className="font-medium text-foreground">{detection.confidence}% confidence</span>
                            </div>
                            {detection.notes && (
                              <div className="mt-2 flex items-start gap-1 text-sm">
                                <StickyNote className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <span className="text-muted-foreground line-clamp-1">{detection.notes}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleViewDetails(detection)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive bg-transparent"
                              onClick={() => removeDetection(detection.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Suggestions Preview */}
                        <div className="mt-4">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Recommendations:</p>
                          <div className="flex flex-wrap gap-2">
                            {detection.suggestions.slice(0, 2).map((suggestion, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs"
                              >
                                {suggestion.slice(0, 40)}...
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {detections.length > 0 && filteredDetections.length === 0 && (
            <Card className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-semibold">No Results Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search query</p>
            </Card>
          )}
        </div>
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDetection} onOpenChange={() => setSelectedDetection(null)}>
        <DialogContent className="max-w-2xl">
          {selectedDetection && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedDetection.disease}
                  <Badge variant="outline" className={getSeverityColor(selectedDetection.severity)}>
                    {getSeverityLabel(selectedDetection.severity, selectedDetection.noDiseaseDetected)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Detected on {formatDate(selectedDetection.timestamp)} at {formatTime(selectedDetection.timestamp)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={selectedDetection.imageSrc || "/placeholder.svg"}
                    alt={selectedDetection.disease}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Confidence Score</p>
                  <p className="text-2xl font-bold text-primary">{selectedDetection.confidence}%</p>

                  <p className="text-sm font-medium mt-4 mb-2">Recommendations</p>
                  <ul className="space-y-1 text-sm">
                    {selectedDetection.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Personal Notes</p>
                <Textarea
                  placeholder="Add your notes about this detection..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedDetection(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNotes}>Save Notes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Clear All Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Clear All History
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All {detections.length} detection records will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                clearHistory()
                setShowClearDialog(false)
              }}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
