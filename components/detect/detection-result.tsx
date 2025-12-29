"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, AlertCircle, Lightbulb, ExternalLink, Download, Share2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import type { Detection } from "@/lib/store"
import { diseases } from "@/lib/disease-data"

interface DetectionResultProps {
  result: Detection
}

export function DetectionResult({ result }: DetectionResultProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "none":
        return <ShieldCheck className="h-5 w-5 text-success" />
      case "mild":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "moderate":
        return <AlertCircle className="h-5 w-5 text-warning" />
      case "severe":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-success"
    if (confidence >= 60) return "bg-warning"
    return "bg-destructive"
  }

  // Helper function to normalize disease names for matching
  const normalizeDiseaseName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  // Disease name variations for matching
  const variations: Record<string, string[]> = {
    "chicken-skin": ["chicken skin", "keratosis pilaris", "keratosis", "kp"],
    "wart": ["wart", "warts", "verruca", "verrucae", "plantar wart"],
    "eczema": ["eczema", "atopic dermatitis", "dermatitis"],
    "psoriasis": ["psoriasis", "plaque psoriasis"],
    "acne": ["acne", "pimple", "pimples", "acne vulgaris"],
    "ringworm": ["ringworm", "tinea", "tinea corporis"],
    "rosacea": ["rosacea", "acne rosacea"],
    "hives": ["hives", "urticaria"],
    "vitiligo": ["vitiligo", "leukoderma"],
    "melanoma": ["melanoma", "skin cancer", "malignant melanoma"],
  }

  // Function to find disease info by name
  const findDiseaseInfo = (diseaseName: string) => {
    return diseases.find((d) => {
      const detectedName = normalizeDiseaseName(diseaseName)
      const libraryName = normalizeDiseaseName(d.name)
      const libraryId = normalizeDiseaseName(d.id)

      // Direct match
      if (libraryName.includes(detectedName) || detectedName.includes(libraryName)) {
        return true
      }

      // Match by ID
      if (libraryId.includes(detectedName) || detectedName.includes(libraryId)) {
        return true
      }

      // Handle common variations
      for (const [diseaseId, names] of Object.entries(variations)) {
        if (d.id === diseaseId && names.some((name) => detectedName.includes(name) || name.includes(detectedName))) {
          return true
        }
      }

      return false
    })
  }

  // Get all unique detected diseases from predictions
  const getDetectedDiseases = () => {
    const uniqueDiseases: Array<{ name: string; info: typeof diseases[0] | undefined; confidence: number }> = []
    const seenClasses = new Set<string>()

    // Add the main detected disease first
    if (!seenClasses.has(result.disease.toLowerCase())) {
      seenClasses.add(result.disease.toLowerCase())
      uniqueDiseases.push({
        name: result.disease,
        info: findDiseaseInfo(result.disease),
        confidence: result.confidence,
      })
    }

    // Add other diseases from predictions
    if (result.predictions && result.predictions.length > 0) {
      for (const pred of result.predictions) {
        const normalizedClass = pred.class.toLowerCase()
        if (!seenClasses.has(normalizedClass)) {
          seenClasses.add(normalizedClass)
          uniqueDiseases.push({
            name: pred.class,
            info: findDiseaseInfo(pred.class),
            confidence: pred.confidence,
          })
        }
      }
    }

    return uniqueDiseases
  }

  const detectedDiseases = getDetectedDiseases()
  const diseasesWithInfo = detectedDiseases.filter((d) => d.info)
  const isNoDiseaseDetected = result.noDiseaseDetected || result.disease === "No Skin Disease Detected"

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Skin Analysis Result: ${result.disease}`,
        text: `Detection result: ${result.disease} with ${result.confidence}% confidence`,
      })
    }
  }

  const handleDownload = () => {
    const reportData = {
      disease: result.disease,
      confidence: result.confidence,
      severity: result.severity,
      suggestions: result.suggestions,
      timestamp: result.timestamp,
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `skin-analysis-${result.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Main Result Card */}
      <Card className="flex-shrink-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Detection Result</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Disease Name and Severity */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              {getSeverityIcon(result.severity)}
              <div>
                <h3 className="text-xl font-bold">{result.disease}</h3>
                <p className="text-sm text-muted-foreground">
                  {isNoDiseaseDetected ? "Analysis Complete" : "Detected Condition"}
                </p>
              </div>
            </div>
            {!isNoDiseaseDetected && (
              <Badge variant="outline" className={getSeverityColor(result.severity)}>
                {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} Severity
              </Badge>
            )}
            {isNoDiseaseDetected && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Healthy
              </Badge>
            )}
          </div>

          {/* Confidence Score - only show for disease detections */}
          {!isNoDiseaseDetected && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confidence Score</span>
                <span className="font-semibold">{result.confidence}%</span>
              </div>
              <Progress value={result.confidence} className={getConfidenceColor(result.confidence)} />
            </div>
          )}

          {/* Healthy skin message */}
          {isNoDiseaseDetected && (
            <div className="rounded-lg bg-success/5 border border-success/20 p-4">
              <p className="text-sm text-success">
                <strong>Great news!</strong> No skin disease was detected in the analyzed image. 
                Your skin appears to be healthy based on our AI analysis.
              </p>
            </div>
          )}

          {/* Links to Disease Info - Multiple diseases */}
          {diseasesWithInfo.length > 0 && (
            <div className="space-y-2">
              {diseasesWithInfo.length > 1 && (
                <p className="text-sm text-muted-foreground">
                  {diseasesWithInfo.length} conditions detected:
                </p>
              )}
              {diseasesWithInfo.map((disease) => (
                <Link key={disease.info!.id} href={`/library/${disease.info!.id}`}>
                  <Button variant="outline" className="w-full gap-2 bg-transparent justify-between" size="sm">
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Learn more about {disease.info!.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {disease.confidence}%
                    </Badge>
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions Card */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            <CardTitle className="text-lg font-semibold">
              {isNoDiseaseDetected ? "Skin Care Tips" : "Recommendations"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-warning/50 bg-warning/5 flex-shrink-0">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
            <div className="text-sm">
              <p className="font-medium text-warning-foreground">Important Disclaimer</p>
              <p className="mt-1 text-muted-foreground">
                This AI analysis is for informational purposes only and should not replace professional medical advice.
                Please consult a dermatologist for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
