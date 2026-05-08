"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Wifi,
  WifiOff,
  BookOpen,
  Users,
  ArrowRight,
  Play,
} from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Wifi className="h-3.5 w-3.5" />
              <span>Optimized for Low Bandwidth</span>
            </div>

            {/* Heading */}
            <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Quality Education for{" "}
              <span className="text-primary">Rural India</span>
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
              Bridging the digital divide with a classroom platform designed for
              low-bandwidth environments. Learn offline, access study materials,
              and connect with teachers from anywhere.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/register">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  <GraduationCap className="h-5 w-5" />
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login/teacher">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 sm:w-auto"
                >
                  <Users className="h-5 w-5" />
                  Teacher Portal
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-4 lg:justify-start">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground">Rural Colleges</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">Languages</p>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/10">
              {/* Browser Header */}
              <div className="flex items-center gap-2 rounded-t-lg border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-accent" />
                  <div className="h-3 w-3 rounded-full bg-primary/60" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                  ruralclass.edu/dashboard
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="rounded-b-lg bg-background p-4">
                <div className="grid gap-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20" />
                      <div>
                        <div className="h-3 w-24 rounded bg-foreground/20" />
                        <div className="mt-1 h-2 w-16 rounded bg-muted-foreground/20" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                      <WifiOff className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-primary">
                        Offline Ready
                      </span>
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border bg-card p-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <p className="mt-2 text-sm font-medium">Study Notes</p>
                      <p className="text-xs text-muted-foreground">
                        12 new materials
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-3">
                      <Users className="h-5 w-5 text-accent" />
                      <p className="mt-2 text-sm font-medium">Live Classes</p>
                      <p className="text-xs text-muted-foreground">
                        3 scheduled
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Course Progress
                      </span>
                      <span className="text-sm text-primary">68%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-2/3 rounded-full bg-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-4 top-1/4 rounded-lg border border-border bg-card p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <Play className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">Video Lecture</p>
                  <p className="text-xs text-muted-foreground">Low quality mode</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 bottom-1/4 rounded-lg border border-border bg-card p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="text-xs font-medium text-primary">
                  SMS Alerts Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
