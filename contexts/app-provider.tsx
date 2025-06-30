"use client";

import React from "react";
import { AuthProvider } from "./auth-context";
import { ChatProvider } from "./chat-context";
import { UIProvider } from "./ui-context";
import { ErrorBoundary } from "@/components/error-boundary";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <UIProvider>
        <AuthProvider>
          <ChatProvider>{children}</ChatProvider>
        </AuthProvider>
      </UIProvider>
    </ErrorBoundary>
  );
}
