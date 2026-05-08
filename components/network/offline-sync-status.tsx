"use client";

import { useState } from "react";
import { useNetwork } from "@/contexts/network-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  CloudOff,
  RefreshCw,
  Check,
  AlertCircle,
  Loader2,
  HardDrive,
  Upload,
  Download,
} from "lucide-react";

interface SyncItem {
  id: string;
  title: string;
  type: "note" | "assignment" | "submission";
  status: "pending" | "syncing" | "synced" | "failed";
  size: string;
  timestamp: Date;
}

export function OfflineSyncStatus() {
  const { isOnline, offlineSyncPending, clearOfflineSync } = useNetwork();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // Mock sync items
  const [syncItems, setSyncItems] = useState<SyncItem[]>([
    {
      id: "1",
      title: "Assignment 3 Submission",
      type: "submission",
      status: "pending",
      size: "2.4 MB",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      title: "Physics Notes - Chapter 5",
      type: "note",
      status: "pending",
      size: "1.2 MB",
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      title: "Math Assignment Draft",
      type: "assignment",
      status: "synced",
      size: "0.8 MB",
      timestamp: new Date(Date.now() - 86400000),
    },
  ]);

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSyncProgress(i);
    }

    // Update items status
    setSyncItems((prev) =>
      prev.map((item) =>
        item.status === "pending" ? { ...item, status: "synced" as const } : item
      )
    );

    clearOfflineSync();
    setIsSyncing(false);
  };

  const getStatusIcon = (status: SyncItem["status"]) => {
    switch (status) {
      case "pending":
        return <CloudOff className="h-4 w-4 text-orange-500" />;
      case "syncing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "synced":
        return <Check className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: SyncItem["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-600">
            Pending
          </Badge>
        );
      case "syncing":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
            Syncing
          </Badge>
        );
      case "synced":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600">
            Synced
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const getTypeIcon = (type: SyncItem["type"]) => {
    switch (type) {
      case "note":
        return <Download className="h-4 w-4" />;
      case "assignment":
        return <HardDrive className="h-4 w-4" />;
      case "submission":
        return <Upload className="h-4 w-4" />;
    }
  };

  const pendingItems = syncItems.filter((item) => item.status === "pending");
  const totalPendingSize = pendingItems.reduce((acc, item) => {
    const size = parseFloat(item.size);
    return acc + size;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                isOnline ? "bg-green-500/10" : "bg-orange-500/10"
              }`}
            >
              {isOnline ? (
                <Cloud className="h-5 w-5 text-green-600" />
              ) : (
                <CloudOff className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <div>
              <CardTitle>Offline Sync</CardTitle>
              <CardDescription>
                {isOnline
                  ? "Connected - Ready to sync"
                  : "Offline - Changes saved locally"}
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={handleSync}
            disabled={!isOnline || isSyncing || pendingItems.length === 0}
          >
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sync Progress */}
        {isSyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Syncing changes...</span>
              <span>{syncProgress}%</span>
            </div>
            <Progress value={syncProgress} />
          </div>
        )}

        {/* Pending Summary */}
        {pendingItems.length > 0 && !isSyncing && (
          <div className="rounded-lg bg-orange-500/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-600 dark:text-orange-400">
                  {pendingItems.length} items pending sync
                </p>
                <p className="text-sm text-orange-600/80 dark:text-orange-400/80">
                  Total size: {totalPendingSize.toFixed(1)} MB
                </p>
              </div>
              {!isOnline && (
                <Badge variant="outline" className="border-orange-500 text-orange-600">
                  Waiting for connection
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* All Synced */}
        {pendingItems.length === 0 && !isSyncing && (
          <div className="rounded-lg bg-green-500/10 p-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check className="h-5 w-5" />
              <span className="font-medium">All changes synced</span>
            </div>
            <p className="mt-1 text-sm text-green-600/80 dark:text-green-400/80">
              Your content is up to date across all devices.
            </p>
          </div>
        )}

        {/* Sync Items List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Sync Activity</h4>
          <div className="space-y-2">
            {syncItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} • {item.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
