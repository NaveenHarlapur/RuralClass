"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Clock, Upload, Loader2, CheckCircle } from "lucide-react"

export default function AssignmentsPage() {
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
  let allAssignments: any[] = []

  enrolledCourses.forEach((course: any) => {
    course.assignments?.forEach((assignment: any) => {
      const submission = data?.submissions?.find((s: any) => s.assignmentId === assignment.id)
      allAssignments.push({
        ...assignment,
        courseName: course.title,
        status: submission ? submission.status : 'pending',
        daysLeft: Math.max(0, Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
      })
    })
  })

  // Sort: pending first (sorted by daysLeft), then submitted
  allAssignments.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1
    if (a.status !== 'pending' && b.status === 'pending') return 1
    return a.daysLeft - b.daysLeft
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">
          View and submit your course assignments
        </p>
      </div>

      <div className="grid gap-4">
        {allAssignments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-lg font-medium text-foreground">No assignments available</p>
              <p className="text-sm text-muted-foreground">Enjoy your free time!</p>
            </CardContent>
          </Card>
        ) : (
          allAssignments.map((assignment: any) => (
            <Card key={assignment.id} className="border-border/50 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {assignment.title}
                        </h3>
                        {assignment.status === 'pending' && assignment.daysLeft <= 3 && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                            Due Soon
                          </Badge>
                        )}
                        {assignment.status !== 'pending' && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-green-500/10 text-green-600">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Submitted
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {assignment.courseName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    {assignment.status === 'pending' && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {assignment.daysLeft} days left
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-muted/30 p-6 sm:w-48 sm:border-l sm:border-t-0 border-t border-border/50">
                  {assignment.status === 'pending' ? (
                    <Button className="w-full gap-2">
                      <Upload className="h-4 w-4" />
                      Submit
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full gap-2">
                      View Submission
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
