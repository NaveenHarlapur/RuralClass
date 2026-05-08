"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, Loader2, Info } from "lucide-react"

export default function AnnouncementsPage() {
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

  const announcements = data?.announcements || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest news and notices from your teachers
        </p>
      </div>

      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-lg font-medium text-foreground">No announcements</p>
              <p className="text-sm text-muted-foreground">You are all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement: any) => (
            <Card key={announcement.id} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {announcement.title}
                      {announcement.priority === "high" && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                          Important
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(announcement.createdAt).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{announcement.author?.name || "Teacher"}</span>
                      {announcement.course && (
                        <>
                          <span>•</span>
                          <span>{announcement.course.title}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {announcement.message}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
