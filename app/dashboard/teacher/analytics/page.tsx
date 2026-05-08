"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Clock,
  BookOpen,
  BarChart3,
  Loader2
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AnalyticsPage() {
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
  let totalStudents = 0
  let totalNotes = 0
  
  const subjectDistribution: any[] = []
  
  courses.forEach((course: any, idx: number) => {
    totalStudents += course.enrollments?.length || 0
    totalNotes += course.notes?.length || 0
    
    const colors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]
    subjectDistribution.push({
      name: course.title,
      value: course.notes?.length || 1, // Fallback to 1 to show on chart
      color: colors[idx % colors.length]
    })
  })

  const overviewStats = [
    {
      label: "Total Students",
      value: totalStudents.toString(),
      change: "+0%",
      trend: "up",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Materials",
      value: totalNotes.toString(),
      change: "+0%",
      trend: "up",
      icon: Download,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Active Courses",
      value: courses.length.toString(),
      change: "0%",
      trend: "up",
      icon: BookOpen,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Completion Rate",
      value: "0%",
      change: "0%",
      trend: "up",
      icon: TrendingUp,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  // Empty charts for now since actual analytics requires more granular data
  const weeklyData = [
    { name: "Mon", views: 0, downloads: 0 },
    { name: "Tue", views: 0, downloads: 0 },
    { name: "Wed", views: 0, downloads: 0 },
    { name: "Thu", views: 0, downloads: 0 },
    { name: "Fri", views: 0, downloads: 0 },
    { name: "Sat", views: 0, downloads: 0 },
    { name: "Sun", views: 0, downloads: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Track student engagement and content performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <Badge
                  variant={stat.trend === "up" ? "secondary" : "outline"}
                  className="gap-1"
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-chart-2" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Activity Chart */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
            <CardDescription>Views and downloads over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="downloads" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary" />
                <span className="text-sm text-muted-foreground">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-chart-2" />
                <span className="text-sm text-muted-foreground">Downloads</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Content Distribution</CardTitle>
            <CardDescription>Content by course</CardDescription>
          </CardHeader>
          <CardContent>
            {subjectDistribution.length === 0 ? (
              <div className="flex h-48 items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {subjectDistribution.map((subject) => (
                    <div key={subject.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="text-xs text-muted-foreground truncate">
                        {subject.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Content */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Content</CardTitle>
            <CardDescription>Most viewed and downloaded materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No tracking data available yet</p>
            </div>
          </CardContent>
        </Card>

        {/* Student Progress Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Student Progress</CardTitle>
            <CardDescription>Distribution by completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No tracking data available yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
