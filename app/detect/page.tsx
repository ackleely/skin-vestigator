"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { ImageUploader } from "@/components/detect/image-uploader"
import { DetectionResult } from "@/components/detect/detection-result"
import { AnnotatedImage } from "@/components/detect/annotated-image"
import { AnalysisLoading } from "@/components/detect/analysis-loading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAppStore, type Detection } from "@/lib/store"
import { ScanSearch, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DetectPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<Detection | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { addDetection, apiSettings } = useAppStore()

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
          provider: apiSettings.provider,
          roboflowApiKey: apiSettings.roboflowApiKey,
          roboflowModelId: apiSettings.roboflowModelId,
          geminiApiKey: apiSettings.geminiApiKey,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const data = await response.json()

      const detection: Detection = {
        id: crypto.randomUUID(),
        imageSrc: selectedImage,
        disease: data.disease,
        confidence: data.confidence,
        severity: data.severity,
        suggestions: data.suggestions,
        timestamp: new Date(),
        predictions: data.predictions,
        imageWidth: data.imageWidth,
        imageHeight: data.imageHeight,
        noDiseaseDetected: data.noDiseaseDetected,
      }

      setResult(detection)
      addDetection(detection)
    } catch {
      setError("Failed to analyze the image. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => {
    setSelectedImage(null)
    setResult(null)
    setError(null)
  }

  const isApiConfigured =
    (apiSettings.provider === "roboflow" && apiSettings.roboflowApiKey && apiSettings.roboflowModelId) ||
    (apiSettings.provider === "gemini" && apiSettings.geminiApiKey)

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Skin Disease Detection</h1>
            <p className="mt-1 text-muted-foreground">
              Upload or capture an image of the affected skin area for AI analysis
            </p>
          </div>

          {/* API Warning */}
          {!isApiConfigured && (
            <Alert className="mb-6 border-warning/50 bg-warning/5">
              <AlertCircle className="h-4 w-4 text-warning" />
              <AlertTitle className="text-warning-foreground">Demo Mode Active</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                No API key configured. Results will be simulated. Configure your Roboflow or Gemini API key in{" "}
                <a href="/settings" className="font-medium text-primary underline">
                  Settings
                </a>{" "}
                for real detection.
              </AlertDescription>
            </Alert>
          )}

          {/* Before Analysis - Two Column Layout */}
          {!result && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column - Upload */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ScanSearch className="h-5 w-5 text-primary" />
                      Upload Image
                    </CardTitle>
                    <CardDescription>Take a clear, well-lit photo of the affected skin area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageUploader onImageSelect={setSelectedImage} selectedImage={selectedImage} onClear={handleClear} />

                    {selectedImage && !isAnalyzing && !result && (
                      <Button className="w-full mt-4" size="lg" onClick={handleAnalyze}>
                        <ScanSearch className="mr-2 h-5 w-5" />
                        Analyze Skin Condition
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Tips Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Tips for Best Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        Use good lighting - natural daylight works best
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        Keep the camera steady and in focus
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        Capture the affected area clearly without obstructions
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        Include surrounding healthy skin for comparison
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Placeholder or Loading */}
              <div className="space-y-6">
                {isAnalyzing && <AnalysisLoading />}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {!selectedImage && !isAnalyzing && (
                  <Card className="h-full min-h-[400px] flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <div className="rounded-full bg-secondary p-6 w-fit mx-auto">
                        <ScanSearch className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 font-semibold">No Image Selected</h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                        Upload or capture a photo of the affected skin area to begin analysis
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* After Analysis - Better Layout for Results */}
          {result && !isAnalyzing && (
            <div className="space-y-6">
              {/* Top Section - Image and Main Result Side by Side */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Annotated Image */}
                <AnnotatedImage
                  imageSrc={result.imageSrc}
                  predictions={result.predictions}
                  imageWidth={result.imageWidth}
                  imageHeight={result.imageHeight}
                />
                
                {/* Detection Result Summary */}
                <DetectionResult result={result} />
              </div>

              {/* New Analysis Button */}
              <div className="flex justify-center">
                <Button variant="outline" size="lg" onClick={handleClear} className="gap-2">
                  <ScanSearch className="h-5 w-5" />
                  Analyze Another Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
