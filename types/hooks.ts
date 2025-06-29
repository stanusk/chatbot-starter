/**
 * Custom hook return types
 */

import { User } from "@supabase/supabase-js";
import { UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import { ChatSession, ChatMessage, MessageRole } from "./database";
import { ModelID } from "./models";

// Auth hook types
export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Chat hook types
export interface UseChatOptions {
  sessionId?: string;
}

export interface UseChatReturn {
  // Chat state
  input: string;
  setInput: (input: string) => void;
  selectedModelId: ModelID;
  setSelectedModelId: (model: ModelID) => void;
  isReasoningEnabled: boolean;
  setIsReasoningEnabled: (enabled: boolean) => void;
  sessionId: string | null;
  userId: string | null;
  isClient: boolean;
  
  // AI SDK chat state
  messages: UIMessage[];
  status: "error" | "submitted" | "streaming" | "ready";
  isGeneratingResponse: boolean;
  
  // Actions
  sendMessage: () => void;
  stop: () => void;
}

// Chat history hook types
export interface UseChatHistoryOptions {
  onSessionSelect?: (sessionId: string, messages: ChatMessage[]) => void;
}

export interface UseChatHistoryReturn {
  sessions: ChatSession[];
  loading: boolean;
  refreshSessions: () => void;
  refreshSessionsSilently: () => void;
  handleSessionClick: (session: ChatSession) => Promise<void>;
  formatDate: (dateString: string) => string;
}

// Supabase hook types
export interface UseSupabaseReturn {
  // Session operations
  createSession: (userId?: string, title?: string) => Promise<ChatSession | null>;
  getSessions: (userId?: string) => Promise<ChatSession[]>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<boolean>;
  
  // Message operations
  saveMessage: (
    sessionId: string,
    role: MessageRole,
    content: string,
    reasoning?: string,
    score?: number,
    metadata?: Record<string, unknown>
  ) => Promise<ChatMessage | null>;
  getMessages: (sessionId: string) => Promise<ChatMessage[]>;
  
  // Utility operations
  generateTitle: (firstMessage: string, maxLength?: number) => string;
} 