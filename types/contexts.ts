/**
 * Context provider types
 */

import { User } from "@supabase/supabase-js";
import { ChatMessage } from "./database";
import { ChatHistoryRef } from "./components";

// Auth context types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isClient: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Chat context types
export interface ChatContextType {
  // Session state
  selectedSessionId: string | null;
  selectedMessages: ChatMessage[];
  
  // UI state
  sidebarOpen: boolean;
  
  // Actions
  selectSession: (sessionId: string, messages: ChatMessage[]) => void;
  startNewChat: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  handleChatUpdate: () => void;
  
  // Chat history ref for external operations
  chatHistoryRef: React.RefObject<ChatHistoryRef | null>;
}

// UI context types
export interface UIContextType {
  // Loading states
  isGlobalLoading: boolean;
  loadingMessage: string | null;
  
  // Error states
  globalError: string | null;
  
  // Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  setGlobalError: (error: string | null) => void;
  clearGlobalError: () => void;
}

// Provider props
export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface ChatProviderProps {
  children: React.ReactNode;
}

export interface UIProviderProps {
  children: React.ReactNode;
}

export interface AppProviderProps {
  children: React.ReactNode;
} 