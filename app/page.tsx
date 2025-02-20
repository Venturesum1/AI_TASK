import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BrainCog } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="flex items-center space-x-2">
            <BrainCog className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              TaskAI
            </h1>
          </div>
          <p className="max-w-[600px] text-muted-foreground">
            Revolutionize your workflow with AI-powered task management. Get smart suggestions,
            real-time updates, and seamless team collaboration.
          </p>
          <div className="flex gap-4">
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-xl font-semibold">AI-Powered Insights</h3>
            <p className="mt-2 text-muted-foreground">
              Get intelligent task suggestions and automated priority assignments
              based on your team's workflow.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold">Real-Time Collaboration</h3>
            <p className="mt-2 text-muted-foreground">
              Stay in sync with your team through instant updates and live task
              tracking.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold">Smart Integration</h3>
            <p className="mt-2 text-muted-foreground">
              Seamlessly connect with your favorite tools through Slack and Discord
              integration.
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}