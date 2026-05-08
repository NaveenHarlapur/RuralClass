"use client"

import {
  WifiOff,
  Download,
  MessageSquare,
  Globe,
  Bell,
  Battery,
  BookOpen,
  Video,
  Users,
  FileText,
  Shield,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: WifiOff,
    title: "Offline Mode",
    description:
      "Download study materials and access them without internet. Perfect for areas with unreliable connectivity.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "Low Bandwidth Optimized",
    description:
      "Compressed videos, lightweight pages, and smart caching ensure smooth learning even on 2G networks.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: MessageSquare,
    title: "AI Doubt Assistant",
    description:
      "Get instant answers to your questions with our AI-powered chatbot, available 24/7 in multiple languages.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: Globe,
    title: "Regional Languages",
    description:
      "Access content in Hindi, Tamil, Telugu, Kannada, Marathi, and more. Learn in your native language.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: Bell,
    title: "SMS Notifications",
    description:
      "Receive important updates, assignment deadlines, and announcements via SMS when offline.",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    icon: Battery,
    title: "Data Saver Mode",
    description:
      "Reduce data consumption by up to 70% with our optimized content delivery system.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

const additionalFeatures = [
  {
    icon: BookOpen,
    title: "Digital Notes",
    description: "Comprehensive study materials uploaded by expert teachers",
  },
  {
    icon: Video,
    title: "Video Lectures",
    description: "High-quality educational videos with adaptive streaming",
  },
  {
    icon: Users,
    title: "Live Classes",
    description: "Interactive sessions with real-time Q&A support",
  },
  {
    icon: FileText,
    title: "Assignments",
    description: "Submit and track assignments with instant feedback",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "End-to-end encryption for all communications",
  },
  {
    icon: Download,
    title: "Easy Downloads",
    description: "One-click download for offline access to all materials",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for Rural Education
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Features designed specifically to overcome the challenges of
            learning in low-connectivity environments.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardHeader className="pb-2">
                <div
                  className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-20">
          <h3 className="mb-8 text-center text-xl font-semibold text-foreground">
            Everything You Need to Learn
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:bg-card"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {feature.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
