"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, Save, Calendar as CalendarIcon, Users, BarChart, Clock } from "lucide-react";
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
  const [isNoClassDay, setIsNoClassDay] = useState(false);
  const [cumulativeStats, setCumulativeStats] = useState({
    present: 0,
    absent: 0,
    noClassDays: 0,
    totalClasses: 0
  });

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      
      // 1. Load students from localStorage
      const mockUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      const studentsList = mockUsers.filter((u: any) => u.role === "student");
      
      setStudents(studentsList);

      // 2. Initialize attendance data if not already set
      const initialData: Record<string, string> = {};
      studentsList.forEach((student: any) => {
        initialData[student.email] = "NO_CLASS"; // Default as per requirement
      });
      setAttendanceData(initialData);

      // 3. Fetch existing attendance for the selected date
      await fetchExistingAttendance(studentsList, selectedDate);
      
      // 4. Fetch cumulative stats for each student
      await fetchCumulativeStats(studentsList);

    } catch (error: any) {
      console.log(error);
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
        const studentStats: Record<string, { total: number; present: number }> = {};
        
        // Initialize stats for all students
        studentsList.forEach(s => {
          studentStats[s.email] = { total: 0, present: 0 };
        });

        // 1. Calculate Per-Student Cumulative Stats
        let totalPresent = 0;
        let totalAbsent = 0;
        const allDates = new Set<string>();
        const noClassDates = new Set<string>();

        data.forEach((record: any) => {
          const date = record.attendance_date;
          allDates.add(date);

          if (record.status === "PRESENT") {
            totalPresent++;
            if (studentStats[record.student_email]) {
              studentStats[record.student_email].total++;
              studentStats[record.student_email].present++;
            }
          } else if (record.status === "ABSENT") {
            totalAbsent++;
            if (studentStats[record.student_email]) {
              studentStats[record.student_email].total++;
            }
          } else if (record.status === "NO_CLASS") {
            noClassDates.add(date);
          }
        });

        // 2. Calculate Student Percentages
        const percentages: Record<string, number> = {};
        Object.keys(studentStats).forEach(email => {
          const { total, present } = studentStats[email];
          percentages[email] = total > 0 ? (present / total) * 100 : 0;
        });

        setStudentPercentages(percentages);
        
        // 3. Update Overall Cumulative Stats
        setCumulativeStats({
          present: totalPresent,
          absent: totalAbsent,
          noClassDays: noClassDates.size,
          totalClasses: allDates.size
        });
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

        // Merge with full student list (those not marked will be "NO_CLASS" by default)
        const mergedData: Record<string, string> = {};
        let noClassCount = 0;
        studentsList.forEach((s: any) => {
          const status = existingData[s.email] || "NO_CLASS";
          mergedData[s.email] = status;
          if (status === "NO_CLASS") noClassCount++;
        });
        setAttendanceData(mergedData);
        
        // If all students are marked as NO_CLASS, set the global toggle to true
        if (studentsList.length > 0 && noClassCount === studentsList.length) {
          setIsNoClassDay(true);
        } else {
          setIsNoClassDay(false);
        }
      } else {
        // No records for this date
        setIsNoClassDay(false);
        const initialData: Record<string, string> = {};
        studentsList.forEach((s: any) => {
          initialData[s.email] = "NO_CLASS";
        });
        setAttendanceData(initialData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedDate]);

  const handleStatusChange = (email: string, status: string) => {
    if (isNoClassDay) return;
    setAttendanceData(prev => ({ ...prev, [email]: status }));
  };

  const toggleNoClassDay = () => {
    const newState = !isNoClassDay;
    setIsNoClassDay(newState);
    
    if (newState) {
      // Set everyone to NO_CLASS
      const updatedData: Record<string, string> = {};
      students.forEach(s => {
        updatedData[s.email] = "NO_CLASS";
      });
      setAttendanceData(updatedData);
    }
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      // Loop through students and save one by one to ensure proper upsert/check
      for (const student of students) {
        const status = attendanceData[student.email] || "NO_CLASS";
        
        // Check if exists
        const { data: existing, error: checkError } = await supabase
          .from("attendance")
          .select("id")
          .eq("attendance_date", selectedDate)
          .eq("student_email", student.email)
          .single();
        
        if (checkError && checkError.code !== "PGRST116") { // PGRST116 is "not found"
           console.log("Check error:", checkError);
        }

        if (existing) {
          // Update
          const { error: updateError } = await supabase
            .from("attendance")
            .update({ status })
            .eq("id", existing.id);
          
          if (updateError) {
            console.log(updateError);
            throw updateError;
          }
        } else {
          // Insert
          const { error: insertError } = await supabase
            .from("attendance")
            .insert([{
              student_email: student.email,
              student_name: student.name,
              status: status,
              attendance_date: selectedDate
            }]);

          if (insertError) {
            console.log(insertError);
            throw insertError;
          }
        }
      }

      toast.success("Attendance saved successfully");
      
      // Refresh stats after save
      await fetchCumulativeStats(students);

    } catch (error: any) {
      console.log(error);
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  // Analytics (Cumulative)
  const totalStudents = students.length;
  const { present: cumPresent, absent: cumAbsent, noClassDays, totalClasses } = cumulativeStats;
  
  const totalValidClasses = totalClasses - noClassDays;
  const attendancePercentage = (totalValidClasses > 0 && totalStudents > 0) 
    ? (cumPresent / (totalValidClasses * totalStudents)) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg font-medium">Loading attendance...</span>
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

      {/* Analytics Cards (Cumulative) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
            <div className="text-2xl font-bold text-green-500">{cumPresent}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-red-500">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{cumAbsent}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-orange-500">No Class</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{noClassDays}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-cyan-500">Total Classes</CardTitle>
            <CalendarIcon className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-500">{totalClasses}</div>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Students List</CardTitle>
            <CardDescription>Mark attendance for {new Date(selectedDate).toLocaleDateString()}</CardDescription>
          </div>
          <Button
            variant={isNoClassDay ? "default" : "secondary"}
            className={isNoClassDay ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
            onClick={toggleNoClassDay}
          >
            {isNoClassDay ? "Class Cancelled Today" : "No Class Today"}
          </Button>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
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
                      <tr key={student.email} className="hover:bg-muted/30 transition-colors">
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
                              variant={attendanceData[student.email] === "PRESENT" ? "default" : "outline"}
                              className={attendanceData[student.email] === "PRESENT" ? "bg-green-600 hover:bg-green-700" : ""}
                              onClick={() => handleStatusChange(student.email, "PRESENT")}
                              disabled={isNoClassDay}
                            >
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant={attendanceData[student.email] === "ABSENT" ? "destructive" : "outline"}
                              onClick={() => handleStatusChange(student.email, "ABSENT")}
                              disabled={isNoClassDay}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
              <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-lg font-medium text-foreground">No students registered</p>
              <p className="text-sm text-muted-foreground">Students will appear here once they register.</p>
            </div>
          )}
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
