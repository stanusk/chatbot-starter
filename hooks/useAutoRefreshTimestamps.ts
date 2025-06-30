"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook for automatically refreshing timestamps to keep relative time displays current.
 * Updates every 60 seconds to keep relative time displays current.
 * Synchronized to minute boundaries for consistent updates across components.
 */
export function useAutoRefreshTimestamps() {
  const [refreshKey, setRefreshKey] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTimestamps = () => {
      setRefreshKey(prev => prev + 1);
    };

    // Calculate next update interval based on current time
    const calculateUpdateInterval = () => {
      const now = new Date();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      
      // Update every minute, synchronized to the start of each minute
      // This ensures consistent updates across all components
      const secondsUntilNextMinute = 60 - currentSecond;
      
      return secondsUntilNextMinute * 1000;
    };

    // Set initial timeout to sync with minute boundary
    const initialDelay = calculateUpdateInterval();
    
    const initialTimeout = setTimeout(() => {
      updateTimestamps();
      
      // Then update every minute
      intervalRef.current = setInterval(updateTimestamps, 60 * 1000);
    }, initialDelay);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return refreshKey;
}