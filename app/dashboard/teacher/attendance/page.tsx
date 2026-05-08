"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Calendar,
  Download,
  TrendingUp,
  Loader2
} from "lucide-react"

export default function AttendancePage() {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Tracker</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor and manage student attendance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" disabled>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Attendance Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Student Attendance</CardTitle>
          <CardDescription>View and manage attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-lg font-medium text-foreground">No attendance records yet</p>
            <p className="text-sm text-muted-foreground">Start marking attendance to see data here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
