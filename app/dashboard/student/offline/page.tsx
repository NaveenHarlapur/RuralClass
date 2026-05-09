"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  WifiOff,
  Download,
  Trash2,
  HardDrive,
  FileText,
  Video,
  RefreshCw,
  Loader2,
  Info
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function OfflineContentPage() {
  const { user } = useAuth()
  const [downloads, setDownloads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDownloads = async () => {
    try {
      if (!user?.email) return;
      setIsLoading(true);

      const { data, error } = await supabase
        .from("downloads")
        .select("*")
        .eq("student_email", user.email)
        .order("downloaded_at", { ascending: false });

      if (error) {
        console.log("[Offline] Fetch error:", error);
        throw error;
      }

      setDownloads(data || []);
    } catch (error) {
      console.error("Failed to fetch downloads", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("downloads")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Removed from offline content");
      setDownloads(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.log("[Offline] Delete error:", error);
      toast.error("Failed to remove item");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg font-medium">Loading offline content...</span>
      </div>
    )
  }

  // Calculate storage info
  const calculateTotalSize = () => {
    let totalMB = 0;
    downloads.forEach(d => {
      const sizeStr = d.file_size || "0 MB";
      const match = sizeStr.match(/(\d+(\.\d+)?)/);
      if (match) {
        totalMB += parseFloat(match[0]);
      }
    });
    return totalMB;
  };

  const usedSize = calculateTotalSize();
  const totalStorage = 512; // 512MB limit for offline
  const percentage = Math.min((usedSize / totalStorage) * 100, 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offline Content</h1>
          <p className="mt-1 text-muted-foreground">
            Downloaded materials available without internet
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={fetchDownloads}>
          <RefreshCw className="h-4 w-4" />
          Sync Now
        </Button>
      </div>

      {/* Storage Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                <HardDrive className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Offline Storage</h3>
                <p className="text-sm text-muted-foreground">
                  {usedSize.toFixed(1)} MB used of {totalStorage} MB
                </p>
              </div>
            </div>
            <div className="w-full sm:w-64">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="font-medium text-foreground">{percentage}%</span>
              </div>
              <Progress value={Number(percentage)} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Banner */}
      <Card className="border-chart-2/30 bg-chart-2/10">
        <CardContent className="flex items-center gap-3 p-4">
          <WifiOff className="h-5 w-5 text-chart-2" />
          <div>
            <p className="font-medium text-foreground">You&apos;re Offline Ready</p>
            <p className="text-sm text-muted-foreground">
              {downloads.length} items available for offline access
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Downloaded Content */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Downloaded Content</h2>
        <div className="space-y-3">
          {downloads.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Download className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-lg font-medium text-foreground">No downloads yet</p>
                <p className="text-sm text-muted-foreground">Download notes to view them offline.</p>
              </CardContent>
            </Card>
          ) : (
            downloads.map((d) => (
              <Card key={d.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        {d.file_type === "pdf" ? (
                          <FileText className="h-6 w-6 text-primary" />
                        ) : (
                          <Video className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{d.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {d.file_type?.toUpperCase()} • {d.file_size}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Downloaded: {new Date(d.downloaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(d.file_url, '_blank')}>
                        Open
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(d.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
