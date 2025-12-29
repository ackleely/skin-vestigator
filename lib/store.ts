"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
  class: string
  confidence: number
}

export interface Detection {
  id: string
  imageSrc: string
  disease: string
  confidence: number
  severity: "mild" | "moderate" | "severe" | "none"
  suggestions: string[]
  timestamp: Date
  notes?: string
  predictions?: BoundingBox[]
  imageWidth?: number
  imageHeight?: number
  noDiseaseDetected?: boolean
}

export interface APISettings {
  provider: "roboflow" | "gemini"
  roboflowApiKey: string
  roboflowModelId: string
  geminiApiKey: string
}

interface AppState {
  detections: Detection[]
  apiSettings: APISettings
  addDetection: (detection: Detection) => void
  removeDetection: (id: string) => void
  clearHistory: () => void
  updateApiSettings: (settings: Partial<APISettings>) => void
  updateDetectionNotes: (id: string, notes: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      detections: [],
      apiSettings: {
        provider: "roboflow",
        roboflowApiKey: "fXj5hGY6PxOl93iX5WP2",
        roboflowModelId: "skin-diseases-detection-mbz2z-jozjo/3",
        geminiApiKey: "AIzaSyAnd5GSPO5SfZDqaLmazPFz3daIFVOFb3c",
      },
      addDetection: (detection) =>
        set((state) => ({
          detections: [detection, ...state.detections],
        })),
      removeDetection: (id) =>
        set((state) => ({
          detections: state.detections.filter((d) => d.id !== id),
        })),
      clearHistory: () => set({ detections: [] }),
      updateApiSettings: (settings) =>
        set((state) => ({
          apiSettings: { ...state.apiSettings, ...settings },
        })),
      updateDetectionNotes: (id, notes) =>
        set((state) => ({
          detections: state.detections.map((d) => (d.id === id ? { ...d, notes } : d)),
        })),
    }),
    {
      name: "dermascan-storage",
    },
  ),
)
