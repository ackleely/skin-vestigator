"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  onImageSelect: (image: string) => void
  selectedImage: string | null
  onClear: () => void
}

export function ImageUploader({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          onImageSelect(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageSelect],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  if (selectedImage) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full max-w-md mx-auto">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Selected skin image"
              fill
              className="object-contain"
            />
            <Button variant="destructive" size="icon" className="absolute right-2 top-2" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="rounded-full bg-primary/10 p-4">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
          <p className="mt-4 text-center font-medium">Drag and drop an image here</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">or click to browse from your device</p>
          <p className="mt-2 text-xs text-muted-foreground">Supports: JPG, PNG, WebP</p>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full gap-2 bg-transparent"
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
          >
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
