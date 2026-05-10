"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, Calendar, PieChart, Info, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttendance = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_email", user.email)
        .order("attendance_date", { ascending: false });

      if (error) {
        console.log(error);
        throw error;
      }
      setAttendance(data || []);
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to load attendance records");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user]);

  // Calculations (Cumulative)
  const totalRecords = attendance.length;
  const totalPresent = attendance.filter(a => a.status === "PRESENT").length;
  const totalAbsent = attendance.filter(a => a.status === "ABSENT").length;
  
  const uniqueNoClassDates = [...new Set(
    attendance
      .filter(a => a.status === "NO_CLASS")
      .map(a => a.attendance_date)
  )];
  
  const uniqueClassDates = [...new Set(
    attendance.map(a => a.attendance_date)
  )];

  const totalClasses = uniqueClassDates.length;
  const totalNoClass = uniqueNoClassDates.length;
  
  const totalValidClasses = totalClasses - totalNoClass;
  const attendancePercentage = totalValidClasses > 0 ? (totalPresent / totalValidClasses) * 100 : 0;

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
        <p className="text-muted-foreground">Monitor your attendance records and performance</p>
      </div>

      {/* Overview Cards (Cumulative) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-green-500">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{totalPresent}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-red-500">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{totalAbsent}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-orange-500">No Class</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{totalNoClass}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-primary">Attendance %</CardTitle>
            <PieChart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{attendancePercentage.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Detailed record of your class attendance</CardDescription>
        </CardHeader>
        <CardContent>
          {attendance.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Marked By</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {attendance.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">{new Date(record.attendance_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {record.status === "PRESENT" ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Present
                          </Badge>
                        ) : record.status === "ABSENT" ? (
                          <Badge variant="outline" className="text-red-500 border-red-500/20 gap-1">
                            <XCircle className="h-3 w-3" />
                            Absent
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-500 border-orange-500/20 gap-1">
                            <Clock className="h-3 w-3" />
                            No Class
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{record.marked_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-lg font-medium text-foreground">No attendance records found</p>
              <p className="text-sm text-muted-foreground">Contact your teacher if this seems incorrect</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
