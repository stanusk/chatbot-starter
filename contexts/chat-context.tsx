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
  hasPlaceholder: boolean;

  // UI state
  sidebarOpen: boolean;
  sidebarPinned: boolean;

  // Actions
  selectSession: (sessionId: string | null, messages: ChatMessage[]) => void;
  startNewChat: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  handleChatUpdate: () => void;
  handleSessionCreated: (sessionId: string) => void;
  cleanupPlaceholder: () => void;

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
  const [hasPlaceholder, setHasPlaceholder] = useState(false);
  const [sidebarOpen, setSidebarOpenState] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const chatHistoryRef = useRef<ChatHistoryRef>(null);

  const startNewChat = useCallback(() => {
    // If we already have a placeholder, just select it
    if (hasPlaceholder) {
      setSelectedSessionId(null);
      setSelectedMessages([]);
      return;
    }

    // Create new placeholder and select it
    setSelectedSessionId(null);
    setSelectedMessages([]);
    setHasPlaceholder(true);
  }, [hasPlaceholder]);

  const selectSession = useCallback(
    (sessionId: string | null, messages: ChatMessage[]) => {
      // Set the session ID (null for new chat, string for existing session)
      setSelectedSessionId(sessionId);
      setSelectedMessages(messages);

      // If selecting a real session, clear placeholder
      if (sessionId !== null) {
        setHasPlaceholder(false);
      }

      // Only close sidebar on mobile/touch devices when a session is selected, and only if not pinned
      if (window.matchMedia("(pointer: coarse)").matches && !sidebarPinned) {
        setSidebarOpenState(false);
      }
    },
    [sidebarPinned]
  );

  const setSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpenState(open);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpenState((prev) => {
      const newOpen = !prev;
      // When toggling via button, always set pinned state
      setSidebarPinned(newOpen);
      return newOpen;
    });
  }, []);

  const openSidebar = useCallback(() => {
    setSidebarOpenState(true);
    // Don't change pinned state when opening via hover
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpenState(false);
    // Don't change pinned state when closing via hover/ESC
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
    // 3. Clear placeholder since we now have a real session
    // 4. Refresh the sidebar to show the new session

    setSelectedSessionId(sessionId);
    setSelectedMessages([]); // Keep empty since AI SDK manages the messages
    setHasPlaceholder(false); // Clear placeholder since we have real session

    // Refresh the sidebar to show the new session
    if (chatHistoryRef.current) {
      chatHistoryRef.current.refreshSessionsSilently();
    }
  }, []);

  const cleanupPlaceholder = useCallback(() => {
    // Clean up unused placeholder
    if (hasPlaceholder) {
      setHasPlaceholder(false);
      // If we're currently on the placeholder (selectedSessionId is null),
      // we might want to keep the UI state as is, or we could clear it
      // For now, we'll just clear the placeholder flag
    }
  }, [hasPlaceholder]);

  const value: ChatContextType = {
    selectedSessionId,
    selectedMessages,
    hasPlaceholder,
    sidebarOpen,
    sidebarPinned,
    selectSession,
    startNewChat,
    setSidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    handleChatUpdate,
    handleSessionCreated,
    cleanupPlaceholder,
    chatHistoryRef,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
