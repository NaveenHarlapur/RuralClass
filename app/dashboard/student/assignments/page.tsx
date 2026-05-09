"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await fetch("/api/assignments");
        if (res.ok) {
          const data = await res.json();
          console.log("[Student] Fetched assignments from DB:", data.assignments);
          setAssignments(data.assignments || []);
        } else {
          console.error("[Student] Failed to fetch assignments:", res.status);
        }
      } catch (error) {
        console.error("[Student] Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">
          View and submit your course assignments
        </p>
      </div>

      {assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h2 className="text-xl font-semibold">
                {assignment.title}
              </h2>

              <p className="mt-2 text-muted-foreground">
                {assignment.description}
              </p>

              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p>Subject: {assignment.subject}</p>
                <p>Teacher: {assignment.teacher_name}</p>
                <p>Due Date: {new Date(assignment.due_date).toLocaleDateString()}</p>
                <p>Created: {new Date(assignment.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">
            No assignments available
          </h2>
        </div>
      )}
    </div>
  );
}
