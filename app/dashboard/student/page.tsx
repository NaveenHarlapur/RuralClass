"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Download,
  FileText,
  Bell,
  Clock,
  TrendingUp,
  WifiOff,
  Calendar,
  MessageSquare,
  Loader2,
  PlusCircle,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null)


  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard/student')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard", error)
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      const res = await fetch('/api/courses')
      if (res.ok) {
        const json = await res.json()
        setAvailableCourses(json.courses || [])
      }
    } catch (error) {
      console.error("Failed to fetch courses", error)
    }
  }

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true)
      await Promise.all([fetchDashboard(), fetchAvailableCourses()])
      

      
      setIsLoading(false)
    }
    loadAll()
  }, [])

  const handleEnroll = async (courseId: string) => {
    setIsEnrolling(courseId)
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })
      const result = await res.json()
      if (res.ok) {
        toast.success("Enrolled successfully!")
        await fetchDashboard() // Refresh dashboard
      } else {
        toast.error(result.error || "Failed to enroll")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsEnrolling(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const enrolledCourses = data?.courses || []
  const announcements = data?.announcements || []
  
  let totalAssignments = 0
  let totalNotes = 0
  let pendingAssignments: any[] = []
  let recentNotes: any[] = []
  let averageProgress = 0

  if (enrolledCourses.length > 0) {
    const totalProgress = enrolledCourses.reduce((acc: number, curr: any) => acc + (curr.progress || 0), 0)
    averageProgress = Math.round(totalProgress / enrolledCourses.length)
  }

  enrolledCourses.forEach((course: any) => {
    totalAssignments += course.assignments?.length || 0
    totalNotes += course.notes?.length || 0
    
    course.assignments?.forEach((assignment: any) => {
      const isSubmitted = data?.submissions?.some((s: any) => s.assignmentId === assignment.id)
      if (!isSubmitted) {
        pendingAssignments.push({
          ...assignment,
          courseName: course.title,
          daysLeft: Math.max(0, Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
        })
      }
    })

    course.notes?.forEach((note: any) => {
      recentNotes.push({
        ...note,
        subject: course.title,
        date: new Date(note.createdAt).toLocaleDateString()
      })
    })
  })



  pendingAssignments = pendingAssignments.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3)
  recentNotes = recentNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4)

  const quickStats = [
    {
      label: "Courses Enrolled",
      value: enrolledCourses.length.toString(),
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Assignments Due",
      value: pendingAssignments.length.toString(),
      icon: FileText,
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
    },
    {
      label: "Total Notes",
      value: totalNotes.toString(),
      icon: Download,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Average Progress",
      value: `${averageProgress}%`,
      icon: TrendingUp,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  // Filter out already enrolled courses for discovery
  const nonEnrolledCourses = availableCourses.filter(ac => !enrolledCourses.some((ec: any) => ec.id === ac.id))

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Continue your learning journey. You&apos;re making great progress!
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
            <WifiOff className="h-3 w-3" />
            Offline Ready
          </Badge>
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
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Study Notes */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Study Notes</CardTitle>
                <CardDescription>Latest materials from your courses</CardDescription>
              </div>
              <Link href="/dashboard/student/notes">
                <Button variant="ghost" size="sm">
                   View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No notes uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentNotes.map((note, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{note.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {note.subject} • {note.date} • {note.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {note.offline && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <WifiOff className="h-3 w-3" />
                            Offline
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Course Progress</CardTitle>
              <CardDescription>Track your learning across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No courses enrolled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course: any, idx: number) => {
                    const colors = ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]
                    const color = colors[idx % colors.length]
                    return (
                      <div key={course.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{course.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {course.progress}%
                          </span>
                        </div>
                        <Progress value={course.progress} className={`h-2 [&>div]:${color}`} />
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discover Courses */}
          {nonEnrolledCourses.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Discover Courses</CardTitle>
                <CardDescription>Explore available subjects and join now</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {nonEnrolledCourses.slice(0, 4).map((course: any) => (
                    <div key={course.id} className="flex flex-col justify-between rounded-xl border border-border/50 bg-muted/20 p-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{course.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{course.description || "Learn this technical course from expert teachers."}</p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course.students} students
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {course.lessons} materials
                          </span>
                        </div>
                      </div>
                      <Button 
                        className="mt-4 gap-2" 
                        size="sm" 
                        onClick={() => handleEnroll(course.id)}
                        disabled={isEnrolling === course.id}
                      >
                        {isEnrolling === course.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <PlusCircle className="h-4 w-4" />
                        )}
                        Enroll Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Upcoming Assignments */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Assignments Due</CardTitle>
              <Link href="/dashboard/student/assignments">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {pendingAssignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No assignments available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingAssignments.map((assignment, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border/50 bg-muted/30 p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {assignment.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {assignment.courseName}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            assignment.daysLeft <= 3 ? "destructive" : "secondary"
                          }
                          className="text-xs"
                        >
                          {assignment.daysLeft}d left
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Announcements</CardTitle>
              <Link href="/dashboard/student/announcements">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No announcements</p>
                </div>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-3 pr-4">
                    {announcements.map((announcement: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border/50 bg-muted/30 p-3"
                      >
                        <div className="flex items-start gap-2">
                          <Bell
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              announcement.priority === "high"
                                ? "text-destructive"
                                : "text-primary"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-foreground">
                              {announcement.title}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {announcement.message}
                            </p>
                            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* SMS Alert Card */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">SMS Alerts Active</p>
                  <p className="text-xs text-muted-foreground">
                    Get updates even when offline
                  </p>
                </div>
              </div>
              <Button className="mt-3 w-full" size="sm" variant="outline">
                Manage Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
