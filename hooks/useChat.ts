"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat as useAISDKChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { ErrorHandlers } from "@/lib/error-handling";
import { ChatMessage } from "@/lib/supabase";
import { modelID } from "@/lib/models";
import type { ModelID } from "@/types/models";
import { useAuthContext } from "@/contexts";

// Custom options for this hook (extends the centralized type)
interface UseChatOptions {
  selectedSessionId?: string | null;
  selectedMessages?: ChatMessage[];
  onChatUpdate?: () => void;
}

// Use centralized type but extend with additional properties specific to this implementation
interface UseChatReturn {
  // Chat state
  input: string;
  setInput: (input: string) => void;
  selectedModelId: string;
  setSelectedModelId: (model: string) => void;
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

export function useChat({
  selectedSessionId = null,
  selectedMessages = [],
  onChatUpdate,
}: UseChatOptions): UseChatReturn {
  const [input, setInput] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>(
    (process.env.NEXT_PUBLIC_DEFAULT_MODEL as string) || "sonnet-3.7"
  );
  const [isReasoningEnabled, setIsReasoningEnabled] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  
  // Use auth context instead of duplicating auth logic
  const { user, isClient } = useAuthContext();
  const userId = user?.id || null;

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

  // Extract callback handlers for better readability and testability
  const handleResponse = useCallback((response: Response) => {
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
  }, [sessionId, selectedSessionId, onChatUpdate]);

  const handleFinish = useCallback(() => {
    // Also notify when assistant response is complete
    if (onChatUpdate) {
      onChatUpdate();
    }
  }, [onChatUpdate]);

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
    onError: (error) => {
      ErrorHandlers.aiProviderError("Chat streaming error", error, {
        sessionId: currentSessionId || undefined,
        userId: userId || undefined,
        component: "useChat",
        action: "streamText",
        metadata: { selectedModelId, isReasoningEnabled }
      });
    },
    onResponse: handleResponse,
    onFinish: handleFinish,
  });

  // Load selected messages when a session is selected
  useEffect(() => {
    if (selectedMessages && selectedMessages.length > 0) {
      try {
        const formattedMessages = selectedMessages.map((msg) => {
          // Validate required fields before processing
          if (!msg || typeof msg.id !== 'string' || !msg.role || !msg.content) {
            throw new Error(`Invalid message format: missing required fields`);
          }

          // Validate and convert created_at to Date
          let createdAt: Date;
          if (msg.created_at) {
            createdAt = new Date(msg.created_at);
            // Check if date conversion was successful
            if (isNaN(createdAt.getTime())) {
              throw new Error(`Invalid date format for message ${msg.id}: ${msg.created_at}`);
            }
          } else {
            // Fallback to current date if created_at is missing
            createdAt = new Date();
            console.warn(`Message ${msg.id} missing created_at, using current date`);
          }

          return {
            id: msg.id,
            role: msg.role,
            content: msg.content,
            createdAt,
          };
        });
        
        setMessages(formattedMessages);
      } catch (error) {
        ErrorHandlers.componentError("Failed to format selected messages", error, {
          sessionId: selectedSessionId || undefined,
          component: "useChat",
          action: "formatSelectedMessages",
          metadata: { messageCount: selectedMessages?.length }
        });
        
        // Preserve previous messages state to avoid clearing the chat
        // Only clear if there were no previous messages
        if (messages.length === 0) {
          setMessages([]);
        }
      }
    } else if (
      selectedMessages &&
      selectedMessages.length === 0 &&
      selectedSessionId === null
    ) {
      // Clear messages when starting a new chat
      setMessages([]);
    }
  }, [selectedMessages, selectedSessionId, setMessages, messages.length]);

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