"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { ChatMessage } from "@/lib/supabase";
import { ChatHistoryRef } from "@/components/chat-history";

interface ChatContextType {
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

const NEW_CHAT_ID = "__NEW_CHAT__";

export function ChatProvider({ children }: ChatProviderProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);
  const [sidebarOpen, setSidebarOpenState] = useState(false);
  const chatHistoryRef = useRef<ChatHistoryRef>(null);

  const startNewChat = useCallback(() => {
    // Start a new chat - let the API create the session when first message is sent
    setSelectedSessionId(null);
    setSelectedMessages([]);
  }, []);

  const selectSession = useCallback(
    (sessionId: string, messages: ChatMessage[]) => {
      setSelectedSessionId(sessionId === NEW_CHAT_ID ? null : sessionId);
      setSelectedMessages(sessionId === NEW_CHAT_ID ? [] : messages);
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

  const value: ChatContextType = {
    selectedSessionId,
    selectedMessages,
    sidebarOpen,
    selectSession,
    startNewChat,
    setSidebarOpen,
    toggleSidebar,
    handleChatUpdate,
    chatHistoryRef,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
