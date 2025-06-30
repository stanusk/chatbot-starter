"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { ChatMessage } from "@/lib/database";
import { ChatHistoryRef } from "@/components/features";

interface ChatContextType {
  // Session state
  selectedSessionId: string | null;
  selectedMessages: ChatMessage[];

  // UI state
  sidebarOpen: boolean;

  // Actions
  selectSession: (sessionId: string | null, messages: ChatMessage[]) => void;
  startNewChat: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  handleChatUpdate: () => void;
  handleSessionCreated: (sessionId: string) => void;

  // Chat history ref for external operations
  chatHistoryRef: React.RefObject<ChatHistoryRef | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);
  const [sidebarOpen, setSidebarOpenState] = useState(false);
  const chatHistoryRef = useRef<ChatHistoryRef>(null);

  const startNewChat = useCallback(() => {
    // Start a new chat - clear session and messages
    setSelectedSessionId(null);
    setSelectedMessages([]);
  }, []);

  const selectSession = useCallback(
    (sessionId: string | null, messages: ChatMessage[]) => {
      // Set the session ID (null for new chat, string for existing session)
      setSelectedSessionId(sessionId);
      setSelectedMessages(messages);

      // Close sidebar on mobile when a session is selected
      setSidebarOpenState(false);
    },
    []
  );

  const setSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpenState(open);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpenState((prev) => !prev);
  }, []);

  const handleChatUpdate = useCallback(() => {
    // Silently refresh chat history when new messages are sent (avoids blinking)
    if (chatHistoryRef.current) {
      chatHistoryRef.current.refreshSessionsSilently();
    }
  }, []);

  const handleSessionCreated = useCallback((sessionId: string) => {
    // When a new session is created during a NEW_CHAT flow:
    // 1. Update selectedSessionId to the real session ID so UI shows it as selected
    // 2. Keep selectedMessages empty since messages are handled by AI SDK
    // 3. Refresh the sidebar to show the new session

    setSelectedSessionId(sessionId);
    setSelectedMessages([]); // Keep empty since AI SDK manages the messages

    // Refresh the sidebar to show the new session
    if (chatHistoryRef.current) {
      chatHistoryRef.current.refreshSessionsSilently();
    }
  }, []);

  const value: ChatContextType = {
    selectedSessionId,
    selectedMessages,
    sidebarOpen,
    selectSession,
    startNewChat,
    setSidebarOpen,
    toggleSidebar,
    handleChatUpdate,
    handleSessionCreated,
    chatHistoryRef,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
