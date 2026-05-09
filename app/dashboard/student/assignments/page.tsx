"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch assignments from Supabase
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (assignmentsError) {
        console.log(assignmentsError);
        throw assignmentsError;
      }

      // Fetch student's submission records from database
      if (user?.email) {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("submissions")
          .select("*")
          .eq("student_email", user.email);

        if (submissionsError) {
          console.log(submissionsError);
          throw submissionsError;
        }
        setSubmissions(submissionsData || []);
      }

      setAssignments(assignmentsData || []);
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleFileChange = (assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    // Step 3: Fix File Input State
    setSelectedFiles((prev) => ({
      ...prev,
      [assignmentId]: file
    }));
  };

  // Step 4 & 5 & 6 & 7: Fix Submit Button and logic
  const handleSubmitAssignment = async (assignment: any) => {
    const file = selectedFiles[assignment.id];

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setIsSubmitting(assignment.id);

      // Step 5: File Upload Logic
      const filePath = `submissions/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("assignment-submissions")
        .upload(filePath, file);

      if (uploadError) {
        console.log(uploadError);
        alert("Upload failed");
        return;
      }

      // Step 6: Generate Public URL
      const { data: publicUrlData } = supabase.storage
        .from("assignment-submissions")
        .getPublicUrl(filePath);

      const file_url = publicUrlData.publicUrl;

      // Step 7: Save Submission to Database
      const { error: insertError } = await supabase.from("submissions").insert([
        {
          assignment_title: assignment.title,
          student_name: user?.name || "Student",
          student_email: user?.email || "",
          file_name: file.name,
          file_url
        }
      ]);

      if (insertError) {
        console.log(insertError);
        toast.error("Failed to save submission record");
        return;
      }

      // Step 8: After Successful Submit
      toast.success("Assignment submitted successfully!");
      
      // Clear selected file
      setSelectedFiles((prev) => ({
        ...prev,
        [assignment.id]: null
      }));

      // Refresh data to update UI instantly
      await fetchData();

    } catch (error: any) {
      console.log(error);
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(null);
    }
  };

  const getSubmissionStatus = (title: string) => {
    return submissions.find(s => s.assignment_title === title);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg font-medium text-foreground">Loading assignments...</span>
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
        <div className="grid gap-6">
          {assignments.map((assignment) => {
            const submission = getSubmissionStatus(assignment.title);
            const isSubmitted = !!submission;
            const isSubmittingThis = isSubmitting === assignment.id;

            return (
              <Card key={assignment.id} className="border-border/50 bg-card/50 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {assignment.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Subject: {assignment.subject} • Teacher: {assignment.teacher_name}
                      </CardDescription>
                    </div>
                    {/* Step 9: Submission Status */}
                    {isSubmitted ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 px-3 py-1">
                        <CheckCircle className="h-3 w-3" />
                        Submitted
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/20 gap-1 px-3 py-1">
                        <AlertCircle className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    {assignment.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">Due:</span>
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-4 flex flex-col sm:flex-row gap-3">
                  {!isSubmitted ? (
                    <>
                      <div className="flex-1 w-full">
                        <Input
                          type="file"
                          onChange={(e) => handleFileChange(assignment.id, e)}
                          className="bg-background cursor-pointer"
                          disabled={isSubmittingThis}
                        />
                      </div>
                      <Button 
                        onClick={() => handleSubmitAssignment(assignment)}
                        disabled={isSubmittingThis || !selectedFiles[assignment.id]}
                        className="w-full sm:w-auto"
                      >
                        {isSubmittingThis ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading assignment...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Assignment
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Submitted on {new Date(submission.submitted_at).toLocaleString()}
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground/80">No assignments available</h2>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
