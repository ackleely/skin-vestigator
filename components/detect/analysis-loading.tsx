"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ScanSearch, Brain, FileCheck } from "lucide-react"
import { useEffect, useState } from "react"

const steps = [
  { icon: ScanSearch, text: "Analyzing image..." },
  { icon: Brain, text: "Processing with AI model..." },
  { icon: FileCheck, text: "Generating results..." },
]

export function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="relative rounded-full bg-primary p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
          </div>
        </div>
        <div className="mt-6 text-center">
          <h3 className="font-semibold">Analyzing Your Image</h3>
          <p className="mt-1 text-sm text-muted-foreground">This may take a few moments</p>
        </div>
        <div className="mt-6 space-y-2 w-full max-w-xs">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = index === currentStep
            const isComplete = index < currentStep
            return (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
                  isActive ? "bg-primary/10" : isComplete ? "opacity-50" : "opacity-30"
                }`}
              >
                <StepIcon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                <span className="text-sm">{step.text}</span>
                {isActive && <Loader2 className="h-3 w-3 animate-spin ml-auto text-primary" />}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
