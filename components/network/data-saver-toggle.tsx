"use client";

import { useNetwork } from "@/contexts/network-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  ImageOff,
  FileDown,
  Wifi,
  HardDrive,
} from "lucide-react";

export function DataSaverToggle() {
  const { dataSaverMode, toggleDataSaverMode, networkSpeed, isOnline } = useNetwork();

  const features = [
    {
      icon: ImageOff,
      title: "Compressed Images",
      description: "Load lower resolution images",
      active: dataSaverMode,
    },
    {
      icon: FileDown,
      title: "Smaller Downloads",
      description: "Download compressed file versions",
      active: dataSaverMode,
    },
    {
      icon: Wifi,
      title: "Reduced Streaming",
      description: "Lower video quality for faster loading",
      active: dataSaverMode,
    },
    {
      icon: HardDrive,
      title: "Offline Caching",
      description: "Save content for offline access",
      active: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Data Saver Mode</CardTitle>
              <CardDescription>
                Optimize for low bandwidth connections
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={dataSaverMode ? "default" : "secondary"}
              className={dataSaverMode ? "bg-primary" : ""}
            >
              {dataSaverMode ? "Active" : "Off"}
            </Badge>
            <Switch
              id="data-saver"
              checked={dataSaverMode}
              onCheckedChange={toggleDataSaverMode}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Network Status */}
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Network</span>
            <Badge
              variant="outline"
              className={
                !isOnline
                  ? "border-destructive text-destructive"
                  : networkSpeed === "slow-2g" || networkSpeed === "2g"
                  ? "border-red-500 text-red-500"
                  : networkSpeed === "3g"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-green-500 text-green-500"
              }
            >
              {!isOnline
                ? "Offline"
                : networkSpeed === "slow-2g"
                ? "Very Slow (2G)"
                : networkSpeed === "2g"
                ? "Slow (2G)"
                : networkSpeed === "3g"
                ? "Moderate (3G)"
                : "Fast (4G+)"}
            </Badge>
          </div>
          {(networkSpeed === "slow-2g" || networkSpeed === "2g") && isOnline && (
            <p className="mt-2 text-sm text-muted-foreground">
              Slow connection detected. We recommend enabling Data Saver mode.
            </p>
          )}
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Optimization Features</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                  feature.active
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-muted/30"
                }`}
              >
                <feature.icon
                  className={`mt-0.5 h-5 w-5 ${
                    feature.active ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Savings Estimate */}
        {dataSaverMode && (
          <div className="rounded-lg bg-green-500/10 p-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Data Saver Active</span>
            </div>
            <p className="mt-1 text-sm text-green-600/80 dark:text-green-400/80">
              Estimated 60% reduction in data usage. Images and files will load
              in compressed format.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
