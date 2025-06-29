"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChatSession, ChatMessage } from "@/lib/supabase";
import { toast } from "sonner";
import { formatRelativeDate } from "@/lib/date-utils";
import { useSupabase } from "./useSupabase";
import { useAuthContext } from "@/contexts";
import type { UseChatHistoryOptions, UseChatHistoryReturn } from "@/types/hooks";

export function useChatHistory({
  onSessionSelect,
}: Omit<UseChatHistoryOptions, 'user'>): UseChatHistoryReturn {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { getSessions, getMessages } = useSupabase();
  const { user, isClient } = useAuthContext();

  const loadSessions = useCallback(async (showLoading = true) => {
    if (!isClient || !user) return;

    if (showLoading) {
      setLoading(true);
    }
    try {
      const userSessions = await getSessions(user.id);
      setSessions(userSessions);
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to load chat history: ${errorMessage}`);
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
  }, [isClient, user, loadSessions]);

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
        const messages = await getMessages(session.id);
        onSessionSelect(session.id, messages);
      } catch (error) {
        console.error("Failed to load chat messages:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Failed to load chat messages: ${errorMessage}`);
      }
    }
  }, [onSessionSelect]);

  const formatDate = (dateString: string) => {
    return formatRelativeDate(dateString);
  };

  return {
    sessions,
    loading,
    refreshSessions,
    refreshSessionsSilently,
    handleSessionClick,
    formatDate,
  };
} 