"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Clock, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all announcements from Supabase
  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[Student] Fetch announcements error:", error)
        return
      }

      console.log("[Student] Fetched announcements:", data?.length)
      setAnnouncements(data || [])
    } catch (error) {
      console.error("[Student] Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()

    // Realtime subscription — auto-update when teacher posts or deletes
    const channel = supabase
      .channel("announcements-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "announcements" },
        (payload) => {
          console.log("[Student] New announcement received:", payload.new)
          setAnnouncements((prev) => [payload.new, ...prev])
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "announcements" },
        (payload) => {
          console.log("[Student] Announcement deleted:", payload.old.id)
          setAnnouncements((prev) => prev.filter(a => a.id !== payload.old.id))
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "announcements" },
        (payload) => {
          console.log("[Student] Announcement updated:", payload.new.id)
          setAnnouncements((prev) => prev.map(a => a.id === payload.new.id ? payload.new : a))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
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
              <p className="text-lg font-medium text-foreground">No announcements available</p>
              <p className="text-sm text-muted-foreground">You are all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement: any) => (
            <Card key={announcement.id} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    {announcement.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(announcement.created_at).toLocaleString()}
                    </span>
                    <span>•</span>
                    <span>{announcement.teacher_name || "Teacher"}</span>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
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
