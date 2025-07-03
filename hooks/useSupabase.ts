"use client";

import { useCallback } from "react";
import { generateChatTitle } from "@/lib/database";
import type { ChatSession, ChatMessage } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";
import type { UseSupabaseReturn } from "@/types/hooks";

/**
 * Provides a set of asynchronous functions for managing chat sessions and messages, including creation, retrieval, updating, and message saving, along with a utility for generating session titles.
 *
 * Returns an object containing methods for session operations, message operations, and title generation, all with integrated error handling.
 */
export function useSupabase(): UseSupabaseReturn {
  const createSession = useCallback(async (_userId?: string, title?: string): Promise<ChatSession | null> => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title || "New Chat" }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.session || null;
    } catch (error) {
      ErrorHandlers.supabaseError("Failed to create chat session", error, {
        component: "useSupabase",
        action: "createSession"
      });
      return null;
    }
  }, []);

  const getSessions = useCallback(async (): Promise<ChatSession[]> => {
    try {
      const response = await fetch('/api/sessions', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.sessions || [];
    } catch (error) {
      ErrorHandlers.supabaseError("Failed to get chat sessions", error, {
        component: "useSupabase",
        action: "getSessions"
      });
      return [];
    }
  }, []);

  const updateSessionTitle = useCallback(async (sessionId: string, title: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      ErrorHandlers.supabaseError("Failed to update session title", error, {
        sessionId,
        component: "useSupabase",
        action: "updateSessionTitle",
        metadata: { title }
      });
      return false;
    }
  }, []);

  const saveMessage = useCallback(async (
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    reasoning?: string,
    score?: number,
    metadata?: Record<string, unknown>
  ): Promise<ChatMessage | null> => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          role,
          content,
          reasoning,
          score,
          metadata,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.message || null;
    } catch (error) {
      ErrorHandlers.supabaseError("Failed to save chat message", error, {
        sessionId,
        component: "useSupabase",
        action: "saveMessage",
        metadata: { role, contentLength: content.length }
      });
      return null;
    }
  }, []);

  const getMessages = useCallback(async (sessionId: string): Promise<ChatMessage[]> => {
    try {
      const response = await fetch(`/api/messages?sessionId=${encodeURIComponent(sessionId)}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      ErrorHandlers.supabaseError("Failed to get chat messages", error, {
        sessionId,
        component: "useSupabase",
        action: "getMessages"
      });
      return [];
    }
  }, []);

  const generateTitle = (firstMessage: string, maxLength: number = 50): string => {
    return generateChatTitle(firstMessage, maxLength);
  };

  return {
    // Session operations
    createSession,
    getSessions,
    updateSessionTitle,
    
    // Message operations
    saveMessage,
    getMessages,
    
    // Utility operations
    generateTitle,
  };
} 