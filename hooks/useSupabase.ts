"use client";

import { useCallback } from "react";
import {
  createChatSession,
  saveChatMessage,
  getChatMessages,
  getChatSessions,
  updateChatSessionTitle,
  generateChatTitle,
} from "@/lib/supabase";
import type { ChatSession, ChatMessage } from "@/lib/supabase";
import { toast } from "sonner";

interface UseSupabaseReturn {
  // Session operations
  createSession: (userId?: string, title?: string) => Promise<ChatSession | null>;
  getSessions: (userId?: string) => Promise<ChatSession[]>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<boolean>;
  
  // Message operations
  saveMessage: (
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    reasoning?: string,
    score?: number,
    metadata?: Record<string, unknown>
  ) => Promise<ChatMessage | null>;
  getMessages: (sessionId: string) => Promise<ChatMessage[]>;
  
  // Utility operations
  generateTitle: (firstMessage: string, maxLength?: number) => string;
}

export function useSupabase(): UseSupabaseReturn {
  const createSession = useCallback(async (userId?: string, title?: string): Promise<ChatSession | null> => {
    try {
      const session = await createChatSession(userId, title);
      return session;
    } catch (error) {
      console.error("Failed to create chat session:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to create chat session: ${errorMessage}`);
      return null;
    }
  }, []);

  const getSessions = useCallback(async (userId?: string): Promise<ChatSession[]> => {
    try {
      const sessions = await getChatSessions(userId);
      return sessions;
    } catch (error) {
      console.error("Failed to get chat sessions:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to load chat sessions: ${errorMessage}`);
      return [];
    }
  }, []);

  const updateSessionTitle = useCallback(async (sessionId: string, title: string): Promise<boolean> => {
    try {
      await updateChatSessionTitle(sessionId, title);
      return true;
    } catch (error) {
      console.error("Failed to update session title:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to update session title: ${errorMessage}`);
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
      console.error("Failed to save chat message:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to save message: ${errorMessage}`);
      return null;
    }
  }, []);

  const getMessages = useCallback(async (sessionId: string): Promise<ChatMessage[]> => {
    try {
      const messages = await getChatMessages(sessionId);
      return messages;
    } catch (error) {
      console.error("Failed to get chat messages:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to load messages: ${errorMessage}`);
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