import { TopNav } from "@/components/top-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { diseases } from "@/lib/disease-data"
import { ArrowLeft, AlertTriangle, Stethoscope, Pill, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function DiseaseDetailPage({ params }: Props) {
  const { id } = await params
  const disease = diseases.find((d) => d.id === id)

  if (!disease) {
    notFound()
  }

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
          {/* Back Button */}
          <Link href="/library">
            <Button variant="ghost" className="mb-4 -ml-2 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{disease.name}</h1>
              <Badge variant="outline" className={getSeverityColor(disease.severity)}>
                {disease.severity}
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">{disease.description}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <Card className="overflow-hidden">
                <div className="relative h-64 sm:h-80">
                  <Image src={disease.image || "/placeholder.svg"} alt={disease.name} fill className="object-cover" />
                </div>
              </Card>

              {/* Symptoms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Symptoms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {disease.symptoms.map((symptom, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Causes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Causes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {disease.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Treatments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-accent" />
                    Treatments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {disease.treatments.map((treatment, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                          {i + 1}
                        </span>
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prevention */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-5 w-5 text-success" />
                    Prevention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {disease.prevention.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* When to See Doctor */}
              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    When to See a Doctor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {disease.whenToSeeDoctor.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card>
                <CardContent className="pt-6">
                  <Link href="/detect">
                    <Button className="w-full">Analyze Your Skin</Button>
                  </Link>
                  <p className="mt-2 text-xs text-center text-muted-foreground">Upload a photo for AI analysis</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
