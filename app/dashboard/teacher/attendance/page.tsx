"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, Save, Calendar as CalendarIcon, Users, BarChart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TeacherAttendancePage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentPercentages, setStudentPercentages] = useState<Record<string, number>>({});

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/teacher/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);

      // Initialize attendance data if not already set
      const initialData: Record<string, string> = {};
      data.forEach((student: any) => {
        initialData[student.email] = "Present"; // Default
      });
      setAttendanceData(initialData);

      // Fetch existing attendance for the selected date
      await fetchExistingAttendance(data, selectedDate);
      
      // Fetch cumulative stats for each student
      await fetchCumulativeStats(data);

    } catch (error: any) {
      console.error("[Teacher] Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCumulativeStats = async (studentsList: any[]) => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("student_email, status");

      if (error) throw error;

      if (data) {
        const stats: Record<string, { total: number; present: number }> = {};
        
        // Initialize stats for all students
        studentsList.forEach(s => {
          stats[s.email] = { total: 0, present: 0 };
        });

        // Calculate counts
        data.forEach((record: any) => {
          if (stats[record.student_email]) {
            stats[record.student_email].total += 1;
            if (record.status === "Present") {
              stats[record.student_email].present += 1;
            }
          }
        });

        // Calculate percentages
        const percentages: Record<string, number> = {};
        Object.keys(stats).forEach(email => {
          const { total, present } = stats[email];
          percentages[email] = total > 0 ? (present / total) * 100 : 0;
        });

        setStudentPercentages(percentages);
      }
    } catch (error) {
      console.error("[Teacher] Error fetching cumulative stats:", error);
    }
  };

  const fetchExistingAttendance = async (studentsList: any[], date: string) => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("attendance_date", date);

      if (error) throw error;

      if (data && data.length > 0) {
        const existingData: Record<string, string> = {};
        data.forEach((record: any) => {
          existingData[record.student_email] = record.status;
        });
        
        // Merge with full student list (those not marked will be "Present" by default)
        const mergedData: Record<string, string> = {};
        studentsList.forEach((s: any) => {
          mergedData[s.email] = existingData[s.email] || "Present";
        });
        setAttendanceData(mergedData);
      }
    } catch (error) {
      console.error("[Teacher] Error fetching existing attendance:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedDate]);

  const handleStatusChange = (email: string, status: string) => {
    setAttendanceData(prev => ({ ...prev, [email]: status }));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const recordsToUpsert = students.map(student => ({
        student_name: student.name,
        student_email: student.email,
        status: attendanceData[student.email],
        attendance_date: selectedDate,
        marked_by: user?.name || "Teacher",
      }));

      const { error } = await supabase
        .from("attendance")
        .upsert(recordsToUpsert, { onConflict: 'student_email,attendance_date' });

      if (error) throw error;

      toast.success(`Attendance saved for ${selectedDate}`);
      
      // Refresh stats after save
      await fetchCumulativeStats(students);

    } catch (error: any) {
      console.error("[Teacher] Error saving attendance:", error);
      toast.error(error.message || "Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  // Analytics
  const totalStudents = students.length;
  const presentCount = Object.values(attendanceData).filter(s => s === "Present").length;
  const absentCount = Object.values(attendanceData).filter(s => s === "Absent").length;
  const attendancePercentage = totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg font-medium">Loading students...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">Mark and track student attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-background border border-input rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-green-500">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{presentCount}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-red-500">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{absentCount}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-primary">Attendance %</CardTitle>
            <BarChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{attendancePercentage.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>Mark attendance for {new Date(selectedDate).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Student Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-center font-medium">Cumulative %</th>
                  <th className="px-4 py-3 text-right font-medium">Daily Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((student) => {
                  const percentage = studentPercentages[student.email] || 0;
                  return (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{student.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{student.email}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={percentage >= 75 ? "outline" : "destructive"} className="font-mono">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant={attendanceData[student.email] === "Present" ? "default" : "outline"}
                            className={attendanceData[student.email] === "Present" ? "bg-green-600 hover:bg-green-700" : ""}
                            onClick={() => handleStatusChange(student.email, "Present")}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={attendanceData[student.email] === "Absent" ? "destructive" : "outline"}
                            onClick={() => handleStatusChange(student.email, "Absent")}
                          >
                            Absent
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 border-t pt-4 flex justify-end">
          <Button 
            onClick={handleSaveAttendance} 
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Attendance
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
