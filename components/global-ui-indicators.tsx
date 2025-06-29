"use client";

import React from "react";
import { useUIContext } from "@/contexts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function GlobalUIIndicators() {
  const { isGlobalLoading, loadingMessage, globalError, clearGlobalError } =
    useUIContext();

  // Global loading indicator
  if (isGlobalLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <div>
              <p className="font-medium">Loading...</p>
              {loadingMessage && (
                <p className="text-sm text-muted-foreground">
                  {loadingMessage}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Global error indicator
  if (globalError) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Card className="w-80">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-destructive">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-destructive">Error</p>
                <p className="text-sm text-muted-foreground">{globalError}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearGlobalError}
                className="h-6 w-6 p-0"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
