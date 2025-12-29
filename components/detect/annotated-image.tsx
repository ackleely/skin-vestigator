"use client"

import { useEffect, useRef, useState } from "react"
import type { BoundingBox } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnnotatedImageProps {
  imageSrc: string
  predictions?: BoundingBox[]
  imageWidth?: number
  imageHeight?: number
}

// Color palette for different classes
const classColors: Record<string, { r: number; g: number; b: number }> = {
  default: { r: 34, g: 197, b: 94 }, // green
}

const getColorForClass = (className: string): { r: number; g: number; b: number } => {
  if (classColors[className]) return classColors[className]
  
  // Generate consistent color based on class name
  let hash = 0
  for (let i = 0; i < className.length; i++) {
    hash = className.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  
  // Convert HSL to RGB (saturation: 70%, lightness: 50%)
  const s = 0.7
  const l = 0.5
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((hue / 60) % 2 - 1))
  const m = l - c / 2
  
  let r = 0, g = 0, b = 0
  if (hue < 60) { r = c; g = x; b = 0 }
  else if (hue < 120) { r = x; g = c; b = 0 }
  else if (hue < 180) { r = 0; g = c; b = x }
  else if (hue < 240) { r = 0; g = x; b = c }
  else if (hue < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

const rgbToString = (color: { r: number; g: number; b: number }) => 
  `rgb(${color.r}, ${color.g}, ${color.b})`

const rgbaToString = (color: { r: number; g: number; b: number }, alpha: number) => 
  `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`

export function AnnotatedImage({ imageSrc, predictions, imageWidth, imageHeight }: AnnotatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    
    img.onload = () => {
      // Calculate display size to fit container while maintaining aspect ratio
      const containerWidth = container.clientWidth
      const maxHeight = 500
      const aspectRatio = img.width / img.height
      
      let displayWidth = containerWidth
      let displayHeight = containerWidth / aspectRatio
      
      if (displayHeight > maxHeight) {
        displayHeight = maxHeight
        displayWidth = maxHeight * aspectRatio
      }
      
      setDisplaySize({ width: displayWidth, height: displayHeight })
      
      // Set canvas size
      canvas.width = displayWidth * scale
      canvas.height = displayHeight * scale
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      // Draw bounding boxes if predictions exist
      if (predictions && predictions.length > 0) {
        const scaleX = canvas.width / (imageWidth || img.width)
        const scaleY = canvas.height / (imageHeight || img.height)
        
        predictions.forEach((pred) => {
          const color = getColorForClass(pred.class)
          
          // Calculate box coordinates (Roboflow returns center x, y with width, height)
          const boxX = (pred.x - pred.width / 2) * scaleX
          const boxY = (pred.y - pred.height / 2) * scaleY
          const boxWidth = pred.width * scaleX
          const boxHeight = pred.height * scaleY
          
          // Draw semi-transparent fill first (very light)
          ctx.fillStyle = rgbaToString(color, 0.1)
          ctx.fillRect(boxX, boxY, boxWidth, boxHeight)
          
          // Draw bounding box
          ctx.strokeStyle = rgbToString(color)
          ctx.lineWidth = 3
          ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)
          
          // Draw label background
          const label = `${pred.class} ${pred.confidence}%`
          ctx.font = "bold 14px Inter, system-ui, sans-serif"
          const textMetrics = ctx.measureText(label)
          const textHeight = 20
          const padding = 6
          
          // Position label at top of box, or bottom if too close to top
          const labelY = boxY > textHeight + padding * 2 ? boxY - textHeight - padding : boxY + boxHeight
          
          ctx.fillStyle = rgbToString(color)
          ctx.fillRect(
            boxX,
            labelY,
            textMetrics.width + padding * 2,
            textHeight + padding
          )
          
          // Draw label text
          ctx.fillStyle = "#ffffff"
          ctx.fillText(label, boxX + padding, labelY + textHeight)
        })
      }
      
      setIsLoaded(true)
    }
    
    img.src = imageSrc
  }, [imageSrc, predictions, imageWidth, imageHeight, scale])

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 2))
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5))

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <ImageIcon className="h-5 w-5 text-primary" />
            Detection Results
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={scale >= 2}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef} 
          className="relative overflow-auto rounded-lg border bg-muted/50"
          style={{ maxHeight: "520px" }}
        >
          <canvas
            ref={canvasRef}
            className="mx-auto block"
            style={{
              width: displaySize.width * scale,
              height: displaySize.height * scale,
            }}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading image...</div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        {predictions && predictions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2">Detected:</span>
            {Array.from(new Set(predictions.map((p) => p.class))).map((className) => {
              const pred = predictions.find((p) => p.class === className)
              const color = getColorForClass(className)
              return (
                <Badge
                  key={className}
                  variant="outline"
                  style={{
                    borderColor: rgbToString(color),
                    backgroundColor: rgbaToString(color, 0.1),
                    color: rgbToString(color),
                  }}
                >
                  {className} ({pred?.confidence}%)
                </Badge>
              )
            })}
          </div>
        )}
        
        {(!predictions || predictions.length === 0) && isLoaded && (
          <p className="mt-3 text-sm text-muted-foreground text-center">
            No bounding boxes available. Bounding boxes are only supported with Roboflow object detection models.
            Gemini provides text-based analysis without location data.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
