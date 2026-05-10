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
  Mail,
  Phone,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { CheckCircle, XCircle } from "lucide-react"

export default function TeacherDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [attendanceStats, setAttendanceStats] = useState({ 
    present: 0, 
    absent: 0, 
    noClass: 0,
    totalClasses: 0
  })
  const [totalStudents, setTotalStudents] = useState(0)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard/teacher')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
        
        // 1. Get total students from localStorage
        const mockUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]")
        const studentCount = mockUsers.filter((u: any) => u.role === "student").length
        setTotalStudents(studentCount)

        // 2. Get cumulative attendance stats
        const { data: attData, error: attError } = await supabase
          .from("attendance")
          .select("status, attendance_date")
        
        if (!attError && attData) {
          const present = attData.filter(a => a.status === "PRESENT").length
          const absent = attData.filter(a => a.status === "ABSENT").length
          
          const uniqueNoClassDates = [...new Set(
            attData
              .filter(a => a.status === "NO_CLASS")
              .map(a => a.attendance_date)
          )]
          
          const uniqueClassDates = [...new Set(
            attData.map(a => a.attendance_date)
          )]

          setAttendanceStats({ 
            present, 
            absent, 
            noClass: uniqueNoClassDates.length,
            totalClasses: uniqueClassDates.length
          })
        }

      } catch (error) {
        console.log("Dashboard fetch error:", error)
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

  // Override total students with localStorage count
  stats.totalStudents = totalStudents
  const recentSubmissions = data?.recentSubmissions || []
  
  // Use mockUsers from localStorage for registered students list
  const mockUsers = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem("mockUsers") || "[]" : "[]")
  const registeredStudents = mockUsers.filter((u: any) => u.role === "student")

  // Build active classes from courses with real counts
  const activeClasses = courses.map((course: any) => ({
    id: course.id,
    title: course.title,
    studentCount: course.enrollments?.length || 0,
    materialsCount: course.notes?.length || 0,
    assignmentsCount: course.assignments?.length || 0,
    lastActivity: course.notes?.[0]?.createdAt || course.createdAt,
  }))

  const validClassesCount = attendanceStats.totalClasses - attendanceStats.noClass;
  const attPercentage = (validClassesCount > 0 && totalStudents > 0)
    ? (attendanceStats.present / (validClassesCount * totalStudents)) * 100
    : 0;

  const quickStats = [
    {
      label: "Total Students",
      value: totalStudents.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      sub: totalStudents === 0
        ? "No students registered"
        : `Across all courses`,
    },
    {
      label: "Total Present",
      value: attendanceStats.present.toString(),
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      sub: `${attPercentage.toFixed(0)}% avg attendance`,
    },
    {
      label: "No Class Today",
      value: attendanceStats.noClass.toString(),
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      sub: "Dates cancelled",
    },
    {
      label: "Total Classes",
      value: attendanceStats.totalClasses.toString(),
      icon: Calendar,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      sub: "Total unique dates",
    },
    {
      label: "Today's Absent",
      value: attendanceStats.absent.toString(),
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      sub: "Cumulative count",
    },
    {
      label: "Active Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
      sub: stats.totalCourses === 0 ? "No courses yet" : "Total active",
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
          <Link href="/dashboard/teacher/assignments">
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              New Assignment
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Registered Students List */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Registered Students</CardTitle>
          <CardDescription>All students currently registered in the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {registeredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="font-medium text-foreground">No students registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Name</th>
                    <th className="px-4 py-3">Contact Info</th>
                    <th className="px-4 py-3">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredStudents.map((student: any) => (
                    <tr key={student.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-foreground">
                        {student.name}
                      </td>
                      <td className="px-4 py-4 space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="text-xs">{student.email}</span>
                        </div>
                        {student.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{student.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">{new Date(student.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
