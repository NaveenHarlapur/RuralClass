"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock, 
  Loader2, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Calendar,
  ChevronRight
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"

export default function ProgressPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const calculateProgress = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);

      // Fetch all required data in parallel
      const [
        { data: attendanceData },
        { data: assignmentsData },
        { data: submissionsData },
        { data: downloadsData },
        { data: materialsData }
      ] = await Promise.all([
        supabase.from("attendance").select("*").eq("student_email", user.email),
        supabase.from("assignments").select("*"),
        supabase.from("submissions").select("*").eq("student_email", user.email),
        supabase.from("downloads").select("*").eq("student_email", user.email),
        supabase.from("materials").select("*")
      ]);

      // 1. Attendance Progress
      const totalClasses = attendanceData?.length || 0;
      const presentClasses = attendanceData?.filter(a => a.status === "Present").length || 0;
      const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

      // 2. Assignment Progress
      const totalAssignments = assignmentsData?.length || 0;
      const submittedAssignments = submissionsData?.length || 0;
      const assignmentCompletion = totalAssignments > 0 ? (submittedAssignments / totalAssignments) * 100 : 0;

      // 3. Material Engagement
      const totalMaterials = materialsData?.length || 0;
      const downloadedMaterials = downloadsData?.length || 0;
      const materialProgress = totalMaterials > 0 ? (downloadedMaterials / totalMaterials) * 100 : 0;

      // 4. Overall Progress
      const overallProgress = Math.round((attendancePercentage + assignmentCompletion + materialProgress) / 3);

      setStats({
        overallProgress,
        totalCourses: 4, // Assuming 4 core courses for now or fetch from prisma if needed
        submittedAssignments,
        totalAssignments,
        pendingAssignments: totalAssignments - submittedAssignments,
        attendancePercentage,
        downloadedMaterials,
        totalMaterials,
        materialProgress,
        assignmentCompletion
      });

      // Recent Activity (Merging and sorting latest actions)
      const activities: any[] = [];
      
      attendanceData?.forEach(a => activities.push({
        type: 'attendance',
        title: `Marked ${a.status} in Class`,
        date: new Date(a.attendance_date),
        icon: <Calendar className="h-4 w-4" />
      }));

      submissionsData?.forEach(s => activities.push({
        type: 'submission',
        title: `Submitted ${s.assignment_title}`,
        date: new Date(s.submitted_at),
        icon: <CheckCircle2 className="h-4 w-4" />
      }));

      downloadsData?.forEach(d => activities.push({
        type: 'download',
        title: `Downloaded ${d.title}`,
        date: new Date(d.downloaded_at),
        icon: <Download className="h-4 w-4" />
      }));

      activities.sort((a, b) => b.date.getTime() - a.date.getTime());
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.log("[Progress] Calculation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculateProgress();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg font-medium">Loading progress...</span>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold">No learning activity yet</h2>
        <p className="text-muted-foreground">Your progress will appear once you start attending classes and submitting assignments.</p>
      </div>
    );
  }

  const getStatusBadge = (progress: number) => {
    if (progress <= 30) return <Badge variant="outline" className="text-orange-500 border-orange-500/20 bg-orange-500/10">Beginner</Badge>;
    if (progress <= 60) return <Badge variant="outline" className="text-yellow-500 border-yellow-500/20 bg-yellow-500/10">Improving</Badge>;
    if (progress <= 85) return <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/10">Good</Badge>;
    return <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">Excellent</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Progress</h1>
          <p className="text-muted-foreground">Real-time analysis of your academic journey</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last updated: Just now</span>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="overflow-hidden border-primary/20 bg-primary/5">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-primary/10 flex flex-col justify-center items-center text-center">
              <div className="relative h-24 w-24 mb-4">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    className="stroke-muted fill-none"
                    strokeWidth="3"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-primary fill-none transition-all duration-1000 ease-out"
                    strokeWidth="3"
                    strokeDasharray={`${stats.overallProgress}, 100`}
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{stats.overallProgress}%</span>
                </div>
              </div>
              <h3 className="font-semibold">Overall Performance</h3>
              {getStatusBadge(stats.overallProgress)}
            </div>
            
            <div className="col-span-3 p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Submissions</p>
                <p className="text-2xl font-bold">{stats.submittedAssignments}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold">{stats.attendancePercentage.toFixed(0)}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold">{stats.downloadedMaterials}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Assignments", value: stats.totalAssignments, icon: <FileText className="text-blue-500" /> },
          { label: "Submitted", value: stats.submittedAssignments, icon: <CheckCircle2 className="text-green-500" /> },
          { label: "Pending", value: stats.pendingAssignments, icon: <Clock className="text-orange-500" /> },
          { label: "Materials Downloaded", value: stats.downloadedMaterials, icon: <Download className="text-purple-500" /> },
        ].map((stat, i) => (
          <Card key={i} className="border-border/50 bg-card/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Progress Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Breakdown
          </h2>
          
          <div className="grid gap-4">
            {[
              { label: "Class Attendance", progress: stats.attendancePercentage, icon: <Calendar />, color: "bg-green-500" },
              { label: "Assignment Completion", progress: stats.assignmentCompletion, icon: <FileText />, color: "bg-blue-500" },
              { label: "Material Engagement", progress: stats.materialProgress, icon: <Download />, color: "bg-purple-500" },
            ].map((item, i) => (
              <Card key={i} className="border-border/50 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-muted text-primary">{item.icon}</div>
                      <div>
                        <h4 className="font-medium">{item.label}</h4>
                        <p className="text-xs text-muted-foreground">{item.progress.toFixed(1)}% Completed</p>
                      </div>
                    </div>
                    {getStatusBadge(item.progress)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{item.progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={item.progress} className={`h-2 [&>div]:${item.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </h2>
          <Card className="border-border/50">
            <CardContent className="p-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              ) : (
                <div className="space-y-6">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {activity.icon}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-medium leading-none truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
