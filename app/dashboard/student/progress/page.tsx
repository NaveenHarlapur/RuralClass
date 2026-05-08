"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, TrendingUp, Award, Clock, Loader2, FileText } from "lucide-react"

export default function ProgressPage() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard/student')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const enrolledCourses = data?.courses || []
  const overallProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((acc: number, c: any) => acc + (c.progress || 0), 0) / enrolledCourses.length)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Progress</h1>
        <p className="text-muted-foreground">
          Track your academic performance and course completion
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <p className="text-xs text-muted-foreground">Across {enrolledCourses.length} courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Course Progress Details</CardTitle>
            <CardDescription>Detailed breakdown of your enrolled courses</CardDescription>
          </CardHeader>
          <CardContent>
            {enrolledCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-lg font-medium text-foreground">No courses enrolled</p>
              </div>
            ) : (
              <div className="space-y-8">
                {enrolledCourses.map((course: any, idx: number) => {
                  const colors = ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4"]
                  const color = colors[idx % colors.length]
                  
                  return (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{course.title}</span>
                        </div>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className={`h-2 [&>div]:${color}`} />
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
