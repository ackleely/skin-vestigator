import { TopNav } from "@/components/top-nav"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentDetections } from "@/components/dashboard/recent-detections"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SkinTips } from "@/components/dashboard/skin-tips"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main>
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome to Skin-vestigator</h1>
            <p className="mt-1 text-muted-foreground">A common skin condition analysis and health tracking</p>
          </div>

          {/* Stats */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <QuickActions />
              <SkinTips />
            </div>
            <RecentDetections />
          </div>
        </div>
      </main>
    </div>
  )
}
