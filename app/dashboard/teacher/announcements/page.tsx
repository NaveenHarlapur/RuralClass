"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Bell, Clock, Loader2, Send, Megaphone } from "lucide-react"

export default function TeacherAnnouncementsPage() {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch announcements from Supabase on mount
  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Fetch announcements error:", error)
        return
      }

      console.log("[Teacher] Fetched announcements:", data?.length)
      setAnnouncements(data || [])
    } catch (error) {
      console.error("[Teacher] Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  // Submit new announcement
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter an announcement title")
      return
    }
    if (!message.trim()) {
      toast.error("Please enter an announcement message")
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("announcements")
        .insert([
          {
            title: title.trim(),
            message: message.trim(),
            teacher_name: user?.name || "Teacher",
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Insert announcement error:", error)
        toast.error("Failed to post announcement: " + error.message)
        return
      }

      console.log("[Teacher] Announcement created:", data.id, data.title)
      toast.success("Announcement posted successfully!")
      setAnnouncements((prev) => [data, ...prev])
      setTitle("")
      setMessage("")
    } catch (error) {
      console.error("[Teacher] Submit error:", error)
      toast.error("An error occurred while posting announcement")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Announcements</h1>
        <p className="text-muted-foreground">Post announcements for your students</p>
      </div>

      {/* Create Announcement Form */}
      <Card className="border-border/50 max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            New Announcement
          </CardTitle>
          <CardDescription>Create a new announcement visible to all students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ann-title">Title</Label>
            <Input
              id="ann-title"
              placeholder="Enter announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ann-message">Message</Label>
            <Textarea
              id="ann-message"
              placeholder="Write your announcement message..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <Button
            className="w-full sm:w-auto gap-2"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Post Announcement
          </Button>
        </CardContent>
      </Card>

      {/* Announcements List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Recent Announcements ({announcements.length})
          </h2>
          <div className="grid gap-4">
            {announcements.map((ann: any) => (
              <Card key={ann.id} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      {ann.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(ann.created_at).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{ann.teacher_name || "Teacher"}</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {ann.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-lg font-medium text-foreground">No announcements yet</p>
            <p className="text-sm text-muted-foreground">Post your first announcement above</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
