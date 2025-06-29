"use client";

import cn from "classnames";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Messages } from "./messages";
import { modelID } from "@/lib/models";
import { Footnote } from "./footnote";

import { supabase, ChatMessage } from "@/lib/supabase";
import { ChatInput } from "@/components/ui";

interface ChatProps {
  selectedSessionId?: string | null;
  selectedMessages?: ChatMessage[];
  onNewSession?: () => void;
  onChatUpdate?: () => void;
}

export function Chat({
  selectedSessionId = null,
  selectedMessages = [],
  onChatUpdate,
}: ChatProps) {
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
    if (!supabase) {
      console.warn("Supabase not initialized - running without authentication");
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
  }, []);

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

  const { messages, append, status, stop, setMessages } = useChat({
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
  const handleSendMessage = () => {
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

    // Don't refresh immediately - wait for AI response to complete
    // This reduces refresh frequency from 2x to 1x per conversation exchange

    setInput("");
  };

  return (
    <div
      className={cn(
        "px-4 md:px-0 pb-4 pt-8 flex flex-col h-dvh items-center w-full max-w-3xl",
        {
          "justify-between": messages.length > 0,
          "justify-center gap-4": messages.length === 0,
        }
      )}
    >
      {messages.length > 0 ? (
        <Messages messages={messages} status={status} />
      ) : (
        <div className="flex flex-col gap-0.5 sm:text-2xl text-xl w-full">
          <div className="flex flex-row gap-2 items-center">
            <div>Welcome to the AI SDK Reasoning Preview.</div>
          </div>
          <div className="dark:text-zinc-500 text-zinc-400">
            What would you like me to think about today?
          </div>
          {isClient && userId && (
            <div className="text-sm dark:text-zinc-600 text-zinc-500 mt-2">
              Signed in • Messages are being saved to your account
            </div>
          )}
          {isClient && !userId && (
            <div className="text-sm dark:text-zinc-600 text-zinc-500 mt-2">
              Anonymous session • Messages are saved temporarily
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        <ChatInput
          input={input}
          setInput={setInput}
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
          isReasoningEnabled={isReasoningEnabled}
          setIsReasoningEnabled={setIsReasoningEnabled}
          isGeneratingResponse={isGeneratingResponse}
          onSubmit={handleSendMessage}
          onStop={stop}
        />

        <Footnote />
      </div>
    </div>
  );
}
