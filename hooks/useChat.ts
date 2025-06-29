"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat as useAISDKChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { toast } from "sonner";
import { supabase, ChatMessage } from "@/lib/supabase";
import { modelID } from "@/lib/models";

interface UseChatOptions {
  selectedSessionId?: string | null;
  selectedMessages?: ChatMessage[];
  onChatUpdate?: () => void;
}

interface UseChatReturn {
  // Chat state
  input: string;
  setInput: (input: string) => void;
  selectedModelId: modelID;
  setSelectedModelId: (model: modelID) => void;
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

export function useChatLogic({
  selectedSessionId = null,
  selectedMessages = [],
  onChatUpdate,
}: UseChatOptions): UseChatReturn {
  const [input, setInput] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<modelID>("sonnet-3.7");
  const [isReasoningEnabled, setIsReasoningEnabled] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  // Set client flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get user session on component mount
  useEffect(() => {
    if (!isClient || !supabase) {
      if (!supabase) {
        console.warn("Supabase not initialized - running without authentication");
      }
      return;
    }

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase!.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [isClient]);

  // Update session ID when a session is selected from history
  useEffect(() => {
    if (selectedSessionId) {
      setSessionId(selectedSessionId);
      sessionIdRef.current = selectedSessionId;
    } else {
      // When starting a new chat, clear the session ID
      setSessionId(null);
      sessionIdRef.current = null;
    }
  }, [selectedSessionId]);

  const currentSessionId = selectedSessionId || sessionId;

  const { messages, append, status, stop, setMessages } = useAISDKChat({
    id: selectedSessionId || sessionId || "primary",
    api: "/api/chat",
    body: {
      selectedModelId,
      isReasoningEnabled,
      sessionId: currentSessionId,
      userId,
    },
    keepLastMessageOnError: true,
    onError: () => {
      toast.error("An error occurred, please try again!");
    },
    onResponse: (response) => {
      // Extract session ID from response headers if available
      const newSessionId = response.headers.get("X-Session-ID");
      if (newSessionId && !sessionId && !selectedSessionId) {
        // Set both ref (immediate) and state (for UI updates)
        sessionIdRef.current = newSessionId;
        setSessionId(newSessionId);
        // Notify parent that a new session was created
        if (onChatUpdate) {
          onChatUpdate();
        }
      }
    },
    onFinish: () => {
      // Also notify when assistant response is complete
      if (onChatUpdate) {
        onChatUpdate();
      }
    },
  });

  // Load selected messages when a session is selected
  useEffect(() => {
    if (selectedMessages && selectedMessages.length > 0) {
      const formattedMessages = selectedMessages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: new Date(msg.created_at),
      }));
      setMessages(formattedMessages);
    } else if (
      selectedMessages &&
      selectedMessages.length === 0 &&
      selectedSessionId === null
    ) {
      // Clear messages when starting a new chat
      setMessages([]);
    }
  }, [selectedMessages, selectedSessionId, setMessages]);

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  // Extract message sending logic to reuse for both Enter key and button
  const sendMessage = useCallback(() => {
    if (input === "") {
      return;
    }

    if (isGeneratingResponse) {
      return;
    }

    append({
      role: "user",
      content: input,
      createdAt: new Date(),
    });

    setInput("");
  }, [input, isGeneratingResponse, append]);

  return {
    // Chat state
    input,
    setInput,
    selectedModelId,
    setSelectedModelId,
    isReasoningEnabled,
    setIsReasoningEnabled,
    sessionId,
    userId,
    isClient,
    
    // AI SDK chat state
    messages,
    status,
    isGeneratingResponse,
    
    // Actions
    sendMessage,
    stop,
  };
} 