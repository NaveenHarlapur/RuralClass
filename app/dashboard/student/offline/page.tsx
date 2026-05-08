"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  WifiOff,
  Download,
  Trash2,
  HardDrive,
  FileText,
  Video,
  BookOpen,
  RefreshCw,
  Loader2
} from "lucide-react"

export default function OfflineContentPage() {
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
  let offlineContent: any[] = []

  enrolledCourses.forEach((course: any) => {
    course.notes?.forEach((note: any) => {
      if (note.offline) {
        offlineContent.push({
          ...note,
          subject: course.title,
          type: "pdf",
          downloadedOn: new Date(note.createdAt).toLocaleDateString(),
          lastAccessed: "Recently",
        })
      }
    })
  })

  // Mock storage info since we don't track actual device storage
  const storageInfo = {
    used: offlineContent.length * 2.5, // Mock 2.5MB per file
    total: 500,
    percentage: Math.min(((offlineContent.length * 2.5) / 500) * 100, 100).toFixed(1),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offline Content</h1>
          <p className="mt-1 text-muted-foreground">
            Downloaded materials available without internet
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Sync Now
        </Button>
      </div>

      {/* Storage Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                <HardDrive className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Offline Storage</h3>
                <p className="text-sm text-muted-foreground">
                  {storageInfo.used} MB used of {storageInfo.total} MB
                </p>
              </div>
            </div>
            <div className="w-full sm:w-64">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="font-medium text-foreground">{storageInfo.percentage}%</span>
              </div>
              <Progress value={Number(storageInfo.percentage)} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Banner */}
      <Card className="border-chart-2/30 bg-chart-2/10">
        <CardContent className="flex items-center gap-3 p-4">
          <WifiOff className="h-5 w-5 text-chart-2" />
          <div>
            <p className="font-medium text-foreground">You&apos;re Offline Ready</p>
            <p className="text-sm text-muted-foreground">
              {offlineContent.length} items available for offline access
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Downloaded Content */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Downloaded Content</h2>
        <div className="space-y-3">
          {offlineContent.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Download className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-lg font-medium text-foreground">No downloads yet</p>
                <p className="text-sm text-muted-foreground">Download notes to view them offline.</p>
              </CardContent>
            </Card>
          ) : (
            offlineContent.map((content) => (
              <Card key={content.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        {content.type === "pdf" ? (
                          <FileText className="h-6 w-6 text-primary" />
                        ) : (
                          <Video className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{content.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {content.subject} • {content.size}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Downloaded: {content.downloadedOn} • Last accessed: {content.lastAccessed}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <WifiOff className="h-3 w-3" />
                        Offline
                      </Badge>
                      <Button variant="outline" size="sm">
                        Open
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
