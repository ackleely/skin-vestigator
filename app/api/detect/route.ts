import { type NextRequest, NextResponse } from "next/server"
import { getSuggestions } from "@/lib/disease-data"

// Confidence threshold for valid detections (predictions below this are considered "no disease detected")
const CONFIDENCE_THRESHOLD = 0.35 // 35% minimum confidence

// Common skin diseases for simulation
const skinDiseases = [
  { name: "Acne", severityRange: ["mild", "moderate"] as const },
  { name: "Eczema", severityRange: ["mild", "moderate", "severe"] as const },
  { name: "Psoriasis", severityRange: ["mild", "moderate", "severe"] as const },
  { name: "Ringworm", severityRange: ["mild", "moderate"] as const },
  { name: "Rosacea", severityRange: ["mild", "moderate"] as const },
  { name: "Hives", severityRange: ["mild", "moderate"] as const },
  { name: "Vitiligo", severityRange: ["mild", "moderate"] as const },
]

// Response for when no skin disease is detected
const NO_DISEASE_RESPONSE = {
  disease: "No Skin Disease Detected",
  confidence: 100,
  severity: "none" as const,
  suggestions: [
    "Your skin appears healthy in the analyzed image.",
    "Continue maintaining good skincare habits.",
    "Protect your skin from excessive sun exposure.",
    "Stay hydrated and maintain a balanced diet for healthy skin.",
    "If you have concerns, consult a dermatologist for a professional evaluation.",
  ],
  noDiseaseDetected: true,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, provider, roboflowApiKey, roboflowModelId, geminiApiKey } = body

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Check if using Roboflow
    if (provider === "roboflow" && roboflowApiKey && roboflowModelId) {
      try {
        // Extract base64 data from data URL
        const base64Data = image.split(",")[1]

        // Use Roboflow Serverless API
        const response = await fetch(
          `https://serverless.roboflow.com/${roboflowModelId}?api_key=${roboflowApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: base64Data,
          }
        )

        if (response.ok) {
          const data = await response.json()

          // Handle both classification and detection model responses
          if (data.predictions && data.predictions.length > 0) {
            // Filter predictions above confidence threshold
            const validPredictions = data.predictions.filter(
              (p: { confidence: number }) => p.confidence >= CONFIDENCE_THRESHOLD
            )

            // If no valid predictions above threshold, return no disease detected
            if (validPredictions.length === 0) {
              return NextResponse.json(NO_DISEASE_RESPONSE)
            }

            // For object detection models
            const topPrediction = validPredictions.reduce(
              (max: { confidence: number }, p: { confidence: number }) =>
                p.confidence > max.confidence ? p : max,
              validPredictions[0]
            )
            const confidence = Math.round(topPrediction.confidence * 100)
            const severity = confidence > 80 ? "severe" : confidence > 50 ? "moderate" : "mild"

            // Extract all valid predictions with bounding boxes (above threshold)
            const predictions = validPredictions.map((p: {
              x: number
              y: number
              width: number
              height: number
              class: string
              confidence: number
            }) => ({
              x: p.x,
              y: p.y,
              width: p.width,
              height: p.height,
              class: p.class,
              confidence: Math.round(p.confidence * 100),
            }))

            return NextResponse.json({
              disease: topPrediction.class,
              confidence,
              severity,
              suggestions: getSuggestions(topPrediction.class, severity),
              predictions,
              imageWidth: data.image?.width,
              imageHeight: data.image?.height,
            })
          } else if (data.predicted_classes && data.predicted_classes.length > 0) {
            // For classification models
            const topPrediction = data.predicted_classes[0]
            
            // Check if confidence is below threshold
            if (topPrediction.confidence < CONFIDENCE_THRESHOLD) {
              return NextResponse.json(NO_DISEASE_RESPONSE)
            }
            
            const confidence = Math.round(topPrediction.confidence * 100)
            const severity = confidence > 80 ? "severe" : confidence > 50 ? "moderate" : "mild"

            return NextResponse.json({
              disease: topPrediction.class,
              confidence,
              severity,
              suggestions: getSuggestions(topPrediction.class, severity),
            })
          } else if (data.top) {
            // Alternative classification response format
            const rawConfidence = data.confidence || 0.75
            
            // Check if confidence is below threshold
            if (rawConfidence < CONFIDENCE_THRESHOLD) {
              return NextResponse.json(NO_DISEASE_RESPONSE)
            }
            
            const confidence = Math.round(rawConfidence * 100)
            const severity = confidence > 80 ? "severe" : confidence > 50 ? "moderate" : "mild"

            return NextResponse.json({
              disease: data.top,
              confidence,
              severity,
              suggestions: getSuggestions(data.top, severity),
            })
          } else {
            // No predictions at all - return no disease detected
            return NextResponse.json(NO_DISEASE_RESPONSE)
          }
        } else {
          const errorData = await response.text()
          console.error("Roboflow API error response:", errorData)
        }
      } catch (error) {
        console.error("Roboflow API error, falling back to simulation:", error)
      }
    }

    // Check if using Gemini
    if (provider === "gemini" && geminiApiKey) {
      try {
        const base64Data = image.split(",")[1]
        const mimeType = image.split(";")[0].split(":")[1]

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are a dermatology AI assistant. Analyze this skin image and identify any potential skin conditions.
                    
                    Respond in JSON format only with these exact fields:
                    {
                      "disease": "Name of the skin condition detected",
                      "confidence": <number between 60-95>,
                      "severity": "mild" | "moderate" | "severe",
                      "description": "Brief description of what you observe"
                    }
                    
                    If you cannot identify a skin condition or the image is not suitable for analysis, respond with:
                    {
                      "disease": "Unable to detect",
                      "confidence": 0,
                      "severity": "mild",
                      "description": "Reason why analysis could not be performed"
                    }
                    
                    Be conservative in your assessment. Only return JSON, no other text.`,
                    },
                    {
                      inline_data: {
                        mime_type: mimeType,
                        data: base64Data,
                      },
                    },
                  ],
                },
              ],
            }),
          },
        )

        if (response.ok) {
          const data = await response.json()
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text

          if (text) {
            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0])
              const severity = parsed.severity as "mild" | "moderate" | "severe"

              return NextResponse.json({
                disease: parsed.disease,
                confidence: parsed.confidence,
                severity,
                suggestions: getSuggestions(parsed.disease, severity),
              })
            }
          }
        }
      } catch (error) {
        console.error("Gemini API error:", error)
      }
    }

    // Fallback simulation (for demo purposes)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const randomDisease = skinDiseases[Math.floor(Math.random() * skinDiseases.length)]
    const severity = randomDisease.severityRange[Math.floor(Math.random() * randomDisease.severityRange.length)]
    const confidence = Math.floor(Math.random() * 25) + 70

    return NextResponse.json({
      disease: randomDisease.name,
      confidence,
      severity,
      suggestions: getSuggestions(randomDisease.name, severity),
      isSimulated: true,
    })
  } catch {
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
