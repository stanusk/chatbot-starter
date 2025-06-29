"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { UIContextType } from "@/types/contexts";

const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUIContext() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUIContext must be used within a UIProvider");
  }
  return context;
}

interface UIProviderProps {
  children: React.ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [globalError, setGlobalErrorState] = useState<string | null>(null);

  const setGlobalLoading = useCallback((loading: boolean, message?: string) => {
    setIsGlobalLoading(loading);
    setLoadingMessage(message || null);
  }, []);

  const setGlobalError = useCallback((error: string | null) => {
    setGlobalErrorState(error);
  }, []);

  const clearGlobalError = useCallback(() => {
    setGlobalErrorState(null);
  }, []);

  const value: UIContextType = {
    isGlobalLoading,
    loadingMessage,
    globalError,
    setGlobalLoading,
    setGlobalError,
    clearGlobalError,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
