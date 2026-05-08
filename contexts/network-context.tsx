"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type NetworkSpeed = "offline" | "slow-2g" | "2g" | "3g" | "4g" | "fast";

interface NetworkContextType {
  isOnline: boolean;
  networkSpeed: NetworkSpeed;
  dataSaverMode: boolean;
  offlineSyncPending: number;
  toggleDataSaverMode: () => void;
  addToOfflineSync: () => void;
  clearOfflineSync: () => void;
  getSpeedLabel: () => string;
  getSpeedColor: () => string;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [networkSpeed, setNetworkSpeed] = useState<NetworkSpeed>("4g");
  const [dataSaverMode, setDataSaverMode] = useState(false);
  const [offlineSyncPending, setOfflineSyncPending] = useState(0);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check network speed using Navigator API
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    if (connection) {
      const updateSpeed = () => {
        const type = connection.effectiveType as NetworkSpeed;
        setNetworkSpeed(type || "4g");
      };
      updateSpeed();
      connection.addEventListener?.("change", updateSpeed);
    }

    // Load saved data saver preference
    const savedDataSaver = localStorage.getItem("ruralclass_datasaver");
    if (savedDataSaver) {
      setDataSaverMode(savedDataSaver === "true");
    }

    // Load pending sync count
    const pendingSync = localStorage.getItem("ruralclass_pending_sync");
    if (pendingSync) {
      setOfflineSyncPending(parseInt(pendingSync, 10));
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleDataSaverMode = useCallback(() => {
    setDataSaverMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("ruralclass_datasaver", String(newValue));
      return newValue;
    });
  }, []);

  const addToOfflineSync = useCallback(() => {
    setOfflineSyncPending((prev) => {
      const newValue = prev + 1;
      localStorage.setItem("ruralclass_pending_sync", String(newValue));
      return newValue;
    });
  }, []);

  const clearOfflineSync = useCallback(() => {
    setOfflineSyncPending(0);
    localStorage.setItem("ruralclass_pending_sync", "0");
  }, []);

  const getSpeedLabel = useCallback(() => {
    if (!isOnline) return "Offline";
    switch (networkSpeed) {
      case "slow-2g":
        return "Very Slow";
      case "2g":
        return "Slow";
      case "3g":
        return "Moderate";
      case "4g":
        return "Fast";
      case "fast":
        return "Very Fast";
      default:
        return "Unknown";
    }
  }, [isOnline, networkSpeed]);

  const getSpeedColor = useCallback(() => {
    if (!isOnline) return "text-destructive";
    switch (networkSpeed) {
      case "slow-2g":
      case "2g":
        return "text-destructive";
      case "3g":
        return "text-warning";
      case "4g":
      case "fast":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  }, [isOnline, networkSpeed]);

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        networkSpeed,
        dataSaverMode,
        offlineSyncPending,
        toggleDataSaverMode,
        addToOfflineSync,
        clearOfflineSync,
        getSpeedLabel,
        getSpeedColor,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
