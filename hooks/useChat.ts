"use client";

import { useState, useCallback, useEffect } from "react";
import { useChat as useAISDKChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { ErrorHandlers } from "@/lib/error-handling";
import { ChatMessage } from "@/lib/database";
import type { ModelID } from "@/types/models";
import { useAuthContext } from "@/contexts";

// Custom options for this hook
interface UseChatOptions {
  selectedSessionId?: string | null;
  selectedMessages?: ChatMessage[];
  onChatUpdate?: () => void;
  onSessionCreated?: (sessionId: string) => void;
}

// Return type for the hook
interface UseChatReturn {
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
  editMessage: (messageIndex: number, newContent: string) => void;
  stop: () => void;
}

export function useChat({
  selectedSessionId = null,
  selectedMessages = [],
  onChatUpdate,
  onSessionCreated,
}: UseChatOptions): UseChatReturn {
  const [input, setInput] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<ModelID>(
    (process.env.NEXT_PUBLIC_DEFAULT_MODEL as ModelID) || "sonnet-3.7"
  );
  const [isReasoningEnabled, setIsReasoningEnabled] = useState<boolean>(true);
  
  // Use auth context for user info
  const { user, isClient } = useAuthContext();
  const userId = user?.id || null;

  // Session ID comes from props (selectedSessionId) - single source of truth
  const sessionId = selectedSessionId;

  // Handle response from server (extract new session ID if created)
  const handleResponse = useCallback((response: Response) => {
    const newSessionId = response.headers.get("X-Session-ID");
    if (newSessionId && !sessionId && onSessionCreated) {
      // Only notify parent about new session creation
      onSessionCreated(newSessionId);
    }
  }, [sessionId, onSessionCreated]);

  // Handle completion (notify parent to refresh sidebar)
  const handleFinish = useCallback(() => {
    if (onChatUpdate) {
      onChatUpdate();
    }
  }, [onChatUpdate]);

  // AI SDK Chat hook
  const { messages, append, status, stop, setMessages, reload } = useAISDKChat({
    id: sessionId || `new-chat-${Date.now()}`, // Use unique ID for new chats to force reset
    api: "/api/chat",
    initialMessages: selectedMessages?.length > 0 ? 
      selectedMessages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.created_at ? new Date(msg.created_at) : new Date(),
      })) : undefined,
    body: {
      selectedModelId,
      isReasoningEnabled,
      sessionId,
      userId,
    },
    keepLastMessageOnError: true,
    onError: (error) => {
      ErrorHandlers.aiProviderError("Chat streaming error", error, {
        sessionId: sessionId || undefined,
        userId: userId || undefined,
        component: "useChat",
        action: "streamText",
        metadata: { selectedModelId, isReasoningEnabled }
      });
    },
    onResponse: handleResponse,
    onFinish: handleFinish,
  });

  // Reset messages when starting a new chat (sessionId becomes null)
  useEffect(() => {
    if (!sessionId && (!selectedMessages || selectedMessages.length === 0)) {
      // Starting a new chat - clear any existing messages
      setMessages([]);
    }
  }, [sessionId, selectedMessages, setMessages]);

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  // Send message function
  const sendMessage = useCallback(() => {
    if (!input.trim() || isGeneratingResponse) {
      return;
    }

    append({
      role: "user",
      content: input,
      createdAt: new Date(),
    });

    setInput("");
  }, [input, isGeneratingResponse, append]);

  // Edit message function
  const editMessage = useCallback((messageIndex: number, newContent: string) => {
    if (isGeneratingResponse || !newContent.trim()) {
      return;
    }

    // Bounds checking: ensure messageIndex is within valid range
    if (messageIndex < 0 || messageIndex >= messages.length) {
      ErrorHandlers.validationError(
        `Invalid messageIndex: ${messageIndex}. Must be between 0 and ${messages.length - 1}`,
        "Unable to edit message. Please try again.",
        {
          component: "useChat",
          action: "editMessage",
          metadata: { messageIndex, messagesLength: messages.length }
        }
      );
      return;
    }

    // Create a new messages array with only messages up to the edited one
    // and replace the edited message with the new content
    const messagesToKeep = messages.slice(0, messageIndex);
    
    // Create the new edited message
    const editedMessage = {
      id: messages[messageIndex].id,
      role: "user" as const,
      content: newContent,
      createdAt: new Date(),
    };

    // Set the new message array with the edited message
    const newMessages = [...messagesToKeep, editedMessage];
    setMessages(newMessages);

    // Use AI SDK's reload to trigger reprocessing from the current state
    // This should cause it to generate a new assistant response
    // setTimeout is used to delay the reload to ensure state consistency
    // and allow React to complete the state update before triggering the reload
    setTimeout(() => {
      reload();
    }, 100);
  }, [messages, isGeneratingResponse, setMessages, reload]);

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
    editMessage,
    stop,
  };
} 