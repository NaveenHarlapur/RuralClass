"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { FileText, Calendar, Clock, Loader2, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AssignmentsPage() {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [assignments, setAssignments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch assignments from database on mount
  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await fetch("/api/assignments")
        if (res.ok) {
          const data = await res.json()
          console.log("[Teacher] Fetched assignments from DB:", data.assignments)
          setAssignments(data.assignments || [])
        } else {
          console.error("[Teacher] Failed to fetch assignments:", res.status)
        }
      } catch (error) {
        console.error("[Teacher] Fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAssignments()
  }, [])

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter an assignment title")
      return
    }
    if (!description.trim()) {
      toast.error("Please enter an assignment description")
      return
    }
    if (!dueDate) {
      toast.error("Please select a due date")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          subject: "General Programming",
          dueDate,
          teacherName: user?.name || "Teacher",
        }),
      })

      const data = await res.json()
      console.log("[Teacher] Create assignment response:", data)

      if (res.ok && data.success) {
        toast.success("Assignment created successfully")
        setAssignments((prev) => [data.assignment, ...prev])
        setTitle("")
        setDescription("")
        setDueDate("")
      } else {
        toast.error(data.error || "Failed to create assignment")
      }
    } catch (error) {
      console.error("[Teacher] Submit error:", error)
      toast.error("An error occurred while creating assignment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (assignment: any) => {
    const confirmed = window.confirm("Are you sure you want to delete this assignment?")
    if (!confirmed) return

    try {
      // Delete from assignment_submissions first (foreign key/related data)
      const { error: subError } = await supabase
        .from("assignment_submissions")
        .delete()
        .eq("assignment_id", assignment.id)

      if (subError) {
        console.log("SUBMISSION DELETE ERROR:", subError)
        // We continue even if subError, because assignment might not have submissions
      }

      // Delete the assignment
      const { error: assignError } = await supabase
        .from("assignments")
        .delete()
        .eq("id", assignment.id)

      if (assignError) {
        console.log("ASSIGNMENT DELETE ERROR:", assignError)
        toast.error("Failed to delete assignment")
        return
      }

      // Success
      toast.success("Assignment deleted successfully")
      setAssignments(prev => prev.filter(a => a.id !== assignment.id))
    } catch (error) {
      console.log("DELETE ERROR:", error)
      toast.error("An error occurred during deletion")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Create Assignment</h1>
      
      <Card className="border-border/50 max-w-2xl">
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Enter assignment title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Enter assignment instructions" 
              rows={5} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input 
              id="dueDate" 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          
          <Button 
            className="w-full sm:w-auto" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Assignment
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : assignments.length > 0 ? (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Recently Created Assignments</h2>
          <div className="grid gap-4">
            {assignments.map((assignment: any) => (
              <Card key={assignment.id} className="border-border/50 relative">
                <CardContent className="flex flex-col sm:flex-row gap-4 p-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(assignment)}
                        title="Delete Assignment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {assignment.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Created: {new Date(assignment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl border-border/50">
          <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-lg font-medium text-foreground">No assignments created</p>
          <p className="text-sm text-muted-foreground mt-1">Start by creating your first assignment above.</p>
        </div>
      )}
    </div>
  )
}
