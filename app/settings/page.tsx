"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAppStore } from "@/lib/store"
import { Settings, Key, CheckCircle, ExternalLink, Eye, EyeOff, Bot } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const { apiSettings, updateApiSettings } = useAppStore()
  const [showRoboflowKey, setShowRoboflowKey] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const [formData, setFormData] = useState({
    provider: apiSettings.provider,
    roboflowApiKey: apiSettings.roboflowApiKey,
    roboflowModelId: apiSettings.roboflowModelId,
    geminiApiKey: apiSettings.geminiApiKey,
  })

  // Sync form data when store is hydrated from localStorage
  useEffect(() => {
    setFormData({
      provider: apiSettings.provider,
      roboflowApiKey: apiSettings.roboflowApiKey,
      roboflowModelId: apiSettings.roboflowModelId,
      geminiApiKey: apiSettings.geminiApiKey,
    })
  }, [apiSettings.provider, apiSettings.roboflowApiKey, apiSettings.roboflowModelId, apiSettings.geminiApiKey])

  const handleSave = () => {
    updateApiSettings(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const isConfigured =
    (formData.provider === "roboflow" && formData.roboflowApiKey && formData.roboflowModelId) ||
    (formData.provider === "gemini" && formData.geminiApiKey)

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
            <p className="mt-1 text-muted-foreground">Configure your AI detection model and API settings</p>
          </div>

          {/* Success Alert */}
          {saved && (
            <Alert className="mb-6 border-success/50 bg-success/10">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertTitle className="text-success">Settings Saved</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Your API configuration has been updated successfully.
              </AlertDescription>
            </Alert>
          )}

          {/* API Provider Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Model Provider
              </CardTitle>
              <CardDescription>Choose which AI model to use for skin disease detection</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.provider}
                onValueChange={(value: "roboflow" | "gemini") => setFormData((prev) => ({ ...prev, provider: value }))}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div>
                  <RadioGroupItem value="roboflow" id="roboflow" className="peer sr-only" />
                  <Label
                    htmlFor="roboflow"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-card p-4 cursor-pointer hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <div className="mb-3 rounded-lg bg-secondary p-2">
                      <img src="/roboflow-logo.jpg" alt="Roboflow" className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">Roboflow</p>
                      <p className="text-xs text-muted-foreground mt-1">Use your custom trained model</p>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="gemini" id="gemini" className="peer sr-only" />
                  <Label
                    htmlFor="gemini"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-card p-4 cursor-pointer hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <div className="mb-3 rounded-lg bg-secondary p-2">
                      <img src="/images/gemini.png" alt="Gemini" className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">Google Gemini</p>
                      <p className="text-xs text-muted-foreground mt-1">General vision AI model</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Roboflow Settings */}
          {formData.provider === "roboflow" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Roboflow Configuration
                </CardTitle>
                <CardDescription>Enter your Roboflow API credentials to use your custom model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roboflow-api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="roboflow-api-key"
                      type={showRoboflowKey ? "text" : "password"}
                      placeholder="Enter your Roboflow API key"
                      value={formData.roboflowApiKey}
                      onChange={(e) => setFormData((prev) => ({ ...prev, roboflowApiKey: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowRoboflowKey(!showRoboflowKey)}
                    >
                      {showRoboflowKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roboflow-model-id">Model ID</Label>
                  <Input
                    id="roboflow-model-id"
                    placeholder="e.g., skin-disease-detection/1"
                    value={formData.roboflowModelId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, roboflowModelId: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">Format: project-name/version-number</p>
                </div>

                <a
                  href="https://roboflow.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Get Roboflow API Key
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          )}

          {/* Gemini Settings */}
          {formData.provider === "gemini" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Google Gemini Configuration
                </CardTitle>
                <CardDescription>Enter your Google AI Studio API key for Gemini Vision</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gemini-api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="gemini-api-key"
                      type={showGeminiKey ? "text" : "password"}
                      placeholder="Enter your Gemini API key"
                      value={formData.geminiApiKey}
                      onChange={(e) => setFormData((prev) => ({ ...prev, geminiApiKey: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                    >
                      {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Get Gemini API Key from Google AI Studio
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          )}

          {/* Status Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${isConfigured ? "bg-success" : "bg-warning"}`} />
                <span className="text-sm">
                  {isConfigured ? (
                    <>
                      API configured for{" "}
                      <strong>{formData.provider === "roboflow" ? "Roboflow" : "Google Gemini"}</strong>
                    </>
                  ) : (
                    <>Demo mode active - configure an API for real detection</>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  )
}
