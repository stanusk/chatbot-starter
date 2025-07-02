"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatSession, ChatMessage } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";
import { formatRelativeDate } from "@/utils";
import { useSupabase } from "./useSupabase";
import { useAuthContext } from "@/contexts";
import { useAutoRefreshTimestamps } from "./useAutoRefreshTimestamps";
import type { UseChatHistoryOptions, UseChatHistoryReturn } from "@/types/hooks";

export function useChatHistory({
  onSessionSelect,
}: Omit<UseChatHistoryOptions, 'user'>): UseChatHistoryReturn {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { getSessions, getMessages } = useSupabase();
  const { user, isClient } = useAuthContext();
  
  // Auto-refresh timestamps every minute
  const refreshKey = useAutoRefreshTimestamps();
  
  // Use refs to avoid unnecessary dependencies
  const getSessionsRef = useRef(getSessions);
  const getMessagesRef = useRef(getMessages);
  getSessionsRef.current = getSessions;
  getMessagesRef.current = getMessages;

  const loadSessions = useCallback(async (showLoading = true) => {
    if (!isClient || !user) return;
    
    if (showLoading) {
      setLoading(true);
    }
    try {
      // Don't pass userId since server now uses RLS to filter automatically
      const userSessions = await getSessionsRef.current();
      setSessions(userSessions);
    } catch (error) {
      ErrorHandlers.supabaseError("Failed to load chat sessions", error, {
        userId: user?.id,
        component: "useChatHistory",
        action: "loadSessions"
      });
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [isClient, user]);

  useEffect(() => {
    if (isClient && user) {
      loadSessions();
    } else {
      setSessions([]);
    }
  }, [isClient, user]);

  // Expose refresh function for external use
  const refreshSessions = useCallback(() => {
    if (isClient && user) {
      loadSessions();
    }
  }, [isClient, user, loadSessions]);

  // Silent refresh without loading state (for frequent updates)
  const refreshSessionsSilently = useCallback(() => {
    if (isClient && user) {
      loadSessions(false);
    }
  }, [isClient, user, loadSessions]);

  const handleSessionClick = useCallback(async (session: ChatSession) => {
    if (onSessionSelect) {
      try {
        const messages = await getMessagesRef.current(session.id);
        onSessionSelect(session.id, messages);
      } catch (error) {
        ErrorHandlers.supabaseError("Failed to load chat messages", error, {
          sessionId: session.id,
          component: "useChatHistory",
          action: "handleSessionClick"
        });
      }
    }
  }, [onSessionSelect]);

  const formatDate = useCallback((dateString: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = refreshKey; // Force re-render when refreshKey changes
    return formatRelativeDate(dateString);
  }, [refreshKey]);

  return {
    sessions,
    loading,
    refreshSessions,
    refreshSessionsSilently,
    handleSessionClick,
    formatDate,
  };
} 