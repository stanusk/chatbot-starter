"use client";

import { useCallback } from "react";
import {
  createChatSession,
  saveChatMessage,
  getChatMessages,
  getChatSessions,
  updateChatSessionTitle,
  generateChatTitle,
} from "@/lib/database";
import type { ChatSession, ChatMessage } from "@/lib/database";
import { ErrorHandlers } from "@/lib/error-handling";
import type { UseSupabaseReturn } from "@/types/hooks";

export function useSupabase(): UseSupabaseReturn {
  const createSession = useCallback(async (userId?: string, title?: string): Promise<ChatSession | null> => {
    try {
      const session = await createChatSession(userId, title);
      return session;
    } catch (error) {
      ErrorHandlers.supabaseError("Failed to create chat session", error, {
        userId,
        component: "useSupabase",
        action: "createSession"
      });
      return null;
    }
  }, []);

  const getSessions = useCallback(async (userId?: string): Promise<ChatSession[]> => {
    try {
      const sessions = await getChatSessions(userId);
      return sessions;
    } catch (error) {
      ErrorHandlers.supabaseError("Failed to get chat sessions", error, {
        userId,
        component: "useSupabase",
        action: "getSessions"
      });
      return [];
    }
  }, []);

  const updateSessionTitle = useCallback(async (sessionId: string, title: string): Promise<boolean> => {
    try {
      await updateChatSessionTitle(sessionId, title);
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
      const message = await saveChatMessage(sessionId, role, content, reasoning, score, metadata);
      return message;
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
      const messages = await getChatMessages(sessionId);
      return messages;
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