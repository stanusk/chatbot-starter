"use client";

import React from "react";
import { useUIContext } from "@/contexts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, XIcon } from "@/components/icons";

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
                <AlertTriangleIcon className="h-5 w-5" />
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
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
