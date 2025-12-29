"use client"

import { useState, useMemo } from "react"
import { TopNav } from "@/components/top-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { diseases } from "@/lib/disease-data"
import { Search, ArrowRight, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDiseases = useMemo(() => {
    if (!searchQuery.trim()) return diseases

    const query = searchQuery.toLowerCase()
    return diseases.filter((disease) => {
      // Search in name
      if (disease.name.toLowerCase().includes(query)) return true
      // Search in description
      if (disease.description.toLowerCase().includes(query)) return true
      // Search in symptoms
      if (disease.symptoms.some((s) => s.toLowerCase().includes(query))) return true
      // Search in causes
      if (disease.causes.some((c) => c.toLowerCase().includes(query))) return true
      // Search in treatments
      if (disease.treatments.some((t) => t.toLowerCase().includes(query))) return true
      return false
    })
  }, [searchQuery])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "common":
        return "bg-success/10 text-success border-success/20"
      case "moderate":
        return "bg-warning/10 text-warning-foreground border-warning/20"
      case "serious":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Skin Disease Library</h1>
            <p className="mt-1 text-muted-foreground">Learn about common skin conditions, symptoms, and treatments</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search skin conditions, symptoms, causes..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <p className="mb-4 text-sm text-muted-foreground">
              Found {filteredDiseases.length} result{filteredDiseases.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
          )}

          {/* No Results */}
          {filteredDiseases.length === 0 && (
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">No conditions found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try searching with different keywords or browse all conditions
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </Card>
          )}

          {/* Disease Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDiseases.map((disease) => (
              <Link key={disease.id} href={`/library/${disease.id}`}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">
                      <Image
                        src={disease.image || "/placeholder.svg"}
                        alt={disease.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <Badge
                        variant="outline"
                        className={`absolute bottom-2 right-2 ${getSeverityColor(disease.severity)}`}
                      >
                        {disease.severity}
                      </Badge>
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {disease.name}
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">{disease.description}</CardDescription>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {disease.symptoms.slice(0, 2).map((symptom, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          {symptom.split(" ").slice(0, 3).join(" ")}...
                        </span>
                      ))}
                      {disease.symptoms.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{disease.symptoms.length - 2} more</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
