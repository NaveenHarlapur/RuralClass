"use client";

import { useNetwork } from "@/contexts/network-context";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Wifi,
  WifiOff,
  Signal,
  SignalLow,
  SignalMedium,
  SignalHigh,
  Zap,
  CloudOff,
} from "lucide-react";

export function NetworkIndicator() {
  const { isOnline, networkSpeed, dataSaverMode, offlineSyncPending, getSpeedLabel } =
    useNetwork();

  const getSpeedIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />;
    switch (networkSpeed) {
      case "slow-2g":
        return <SignalLow className="h-4 w-4" />;
      case "2g":
        return <SignalLow className="h-4 w-4" />;
      case "3g":
        return <SignalMedium className="h-4 w-4" />;
      case "4g":
        return <SignalHigh className="h-4 w-4" />;
      case "fast":
        return <Signal className="h-4 w-4" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return "bg-destructive text-destructive-foreground";
    switch (networkSpeed) {
      case "slow-2g":
      case "2g":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "3g":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "4g":
      case "fast":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Network Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`gap-1.5 ${getStatusColor()}`}>
              {getSpeedIcon()}
              <span className="hidden sm:inline">{getSpeedLabel()}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Network: {isOnline ? getSpeedLabel() : "Offline"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Data Saver Mode */}
        {dataSaverMode && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              >
                <Zap className="h-3 w-3" />
                <span className="hidden sm:inline">Saver</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Data Saver Mode Active</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Offline Sync Pending */}
        {offlineSyncPending > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400"
              >
                <CloudOff className="h-3 w-3" />
                <span>{offlineSyncPending}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{offlineSyncPending} items pending sync</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
