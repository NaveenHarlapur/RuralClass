"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, MessageSquare, ThumbsUp, Clock, Plus, Loader2 } from "lucide-react"

export default function DiscussionsPage() {
  // Simulating fetching, but since discussion API isn't built fully, show empty state
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Class Discussions</h1>
          <p className="text-muted-foreground">
            Engage with your peers and teachers, ask questions, and share knowledge
          </p>
        </div>
        <Button className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          New Topic
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search discussions..."
            className="pl-8 bg-background"
          />
        </div>
      </div>

      <div className="grid gap-4">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-lg font-medium text-foreground">No discussions yet</p>
            <p className="text-sm text-muted-foreground">Start a new topic to interact with your class.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
