import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Sun, Droplets, Moon, Apple } from "lucide-react"

const tips = [
  {
    icon: Sun,
    title: "Sun Protection",
    description: "Apply SPF 30+ sunscreen daily, even on cloudy days.",
  },
  {
    icon: Droplets,
    title: "Stay Hydrated",
    description: "Drink 8 glasses of water daily for healthy skin.",
  },
  {
    icon: Moon,
    title: "Quality Sleep",
    description: "Get 7-9 hours of sleep to help skin repair itself.",
  },
  {
    icon: Apple,
    title: "Healthy Diet",
    description: "Eat antioxidant-rich foods for skin protection.",
  },
]

export function SkinTips() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Lightbulb className="h-5 w-5 text-warning" />
        <CardTitle className="text-lg font-semibold">Daily Skin Care Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip) => (
            <div key={tip.title} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <tip.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{tip.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
