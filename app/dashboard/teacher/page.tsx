"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  BookOpen,
  FileText,
  Clock,
  TrendingUp,
  Plus,
  Upload,
  Loader2,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function TeacherDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard/teacher')
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

  const courses = data?.courses || []
  const stats = data?.stats || {
    totalStudents: 0,
    totalCourses: courses.length,
    totalMaterials: 0,
    totalSubmissions: 0,
  }
  const recentSubmissions = data?.recentSubmissions || []

  // Build active classes from courses with real counts
  const activeClasses = courses.map((course: any) => ({
    id: course.id,
    title: course.title,
    studentCount: course.enrollments?.length || 0,
    materialsCount: course.notes?.length || 0,
    assignmentsCount: course.assignments?.length || 0,
    lastActivity: course.notes?.[0]?.createdAt || course.createdAt,
  }))

  const quickStats = [
    {
      label: "Total Students",
      value: stats.totalStudents.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      sub: stats.totalStudents === 0
        ? "No enrollments yet"
        : `Across ${stats.totalCourses} course${stats.totalCourses !== 1 ? 's' : ''}`,
    },
    {
      label: "Active Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
      sub: stats.totalCourses === 0 ? "No courses yet" : "All active",
    },
    {
      label: "Materials Uploaded",
      value: stats.totalMaterials.toString(),
      icon: FileText,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      sub: stats.totalMaterials === 0 ? "Nothing uploaded yet" : "Published notes",
    },
    {
      label: "Submissions",
      value: stats.totalSubmissions.toString(),
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      sub: stats.totalSubmissions === 0 ? "No submissions yet" : "Total received",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Welcome, {user?.name || "Teacher"}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s an overview of your classes and student progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/teacher/upload">
            <Button size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Material
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="truncate text-xs text-muted-foreground/70">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Classes — 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Active Classes</CardTitle>
                <CardDescription>Your currently running courses</CardDescription>
              </div>
              <Badge variant="secondary">{courses.length} total</Badge>
            </CardHeader>
            <CardContent>
              {activeClasses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/40" />
                  <p className="font-medium text-foreground">No courses yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your courses will appear here once created.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeClasses.map((cls: any) => (
                    <div
                      key={cls.id}
                      className="rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* Course info */}
                        <div className="min-w-0 space-y-1.5">
                          <p className="truncate font-medium text-foreground">{cls.title}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {cls.studentCount} student{cls.studentCount !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {cls.materialsCount} material{cls.materialsCount !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {cls.assignmentsCount} assignment{cls.assignmentsCount !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(cls.lastActivity).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Enrollment progress */}
                        <div className="flex items-center gap-3 sm:w-52 sm:shrink-0">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Enrolled</span>
                              <span className="font-medium text-foreground">
                                {cls.studentCount} student{cls.studentCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <Progress
                              value={cls.studentCount > 0 ? Math.min(cls.studentCount * 10, 100) : 0}
                              className="h-1.5"
                            />
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions — 1/3 width */}
        <div>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Submissions</CardTitle>
              <Badge variant="secondary">{recentSubmissions.length}</Badge>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <FileText className="mb-3 h-12 w-12 text-muted-foreground/40" />
                  <p className="font-medium text-foreground">No submissions yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Student submissions will appear here.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-72">
                  <div className="space-y-4 pr-4">
                    {recentSubmissions.map((sub: any, i: number) => (
                      <div
                        key={sub.id || i}
                        className="flex items-start justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="min-w-0 space-y-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {sub.studentName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {sub.assignmentName}
                          </p>
                          <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" className="ml-2 h-7 shrink-0 text-xs">
                          Grade
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
