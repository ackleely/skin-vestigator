"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  ActivitySquareIcon, 
  ArrowRight,
  Scan,
  BookOpen,
  History,
  RotateCcw,
  Shield,
  Zap,
  Lock,
  Heart,
} from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    { icon: Scan, label: "Detect" },
    { icon: BookOpen, label: "Learn" },
    { icon: History, label: "Track" },
  ]

  const backInfo = [
    { icon: Zap, title: "Fast Analysis", desc: "Get results in seconds" },
    { icon: Shield, title: "Accurate AI", desc: "Powered by advanced models" },
    { icon: Lock, title: "Private", desc: "Data stays on your device" },
    { icon: Heart, title: "Free to Use", desc: "No subscriptions needed" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/40 via-background to-accent/40 relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={`absolute top-0 left-0 w-[700px] h-[700px] bg-gradient-to-br from-primary/50 to-primary/10 rounded-full blur-3xl transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ transform: 'translate(-30%, -30%)' }}
        />
        <div 
          className={`absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-accent/50 to-accent/10 rounded-full blur-3xl transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ transform: 'translate(30%, 30%)' }}
        />
        <div 
          className={`absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        
        {/* Flippable Card Container */}
        <div 
          className={`perspective-1000 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ perspective: '1000px' }}
        >
          <div 
            className={`relative w-[340px] sm:w-[420px] h-[480px] sm:h-[520px] transition-transform duration-700 cursor-pointer`}
            style={{ 
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front of Card */}
            <div 
              className="absolute inset-0 rounded-3xl bg-gradient-to-b from-background to-background/80 border border-border/50 shadow-2xl backdrop-blur-sm p-8 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Minimal Logo */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-50" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
                    <ActivitySquareIcon className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

              {/* Typography */}
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Skin</span>
                <span className="text-foreground">-vestigator</span>
              </h1>
              
              <p className="mt-4 text-sm text-muted-foreground text-center max-w-xs font-light">
                AI-powered skin analysis for common conditions
              </p>

              {/* Feature pills */}
              <div className="mt-8 flex justify-center gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    <feature.icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Flip hint */}
              <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/60">
                <RotateCcw className="h-3 w-3" />
                <span>Tap to learn more</span>
              </div>
            </div>

            {/* Back of Card */}
            <div 
              className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary to-primary/90 border border-primary/50 shadow-2xl p-8 flex flex-col items-center justify-center"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Why Skin-vestigator?</h2>
              <p className="text-white/70 text-sm text-center mb-8">Your trusted companion for skin health</p>
              
              <div className="space-y-4 w-full max-w-xs">
                {backInfo.map((info, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                      <info.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{info.title}</p>
                      <p className="text-white/70 text-xs">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Flip hint */}
              <div className="mt-6 flex items-center gap-2 text-xs text-white/50">
                <RotateCcw className="h-3 w-3" />
                <span>Tap to flip back</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button - Outside the card */}
        <div className={`mt-10 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/">
            <Button 
              size="lg" 
              className="group relative px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </div>

        {/* Subtle info text */}
        <p className={`mt-4 text-xs text-muted-foreground/60 transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          Free • No account required • Privacy-focused
        </p>

        {/* Bottom disclaimer - minimal */}
        <div className={`absolute bottom-6 left-0 right-0 text-center transition-all duration-700 delay-600 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs text-muted-foreground/50">
            For educational purposes only • Not a medical diagnosis
          </p>
        </div>
      </div>
    </div>
  )
}
