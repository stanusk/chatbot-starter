"use client";

import cn from "classnames";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Messages } from "./messages";
import { modelID, models } from "@/lib/models";
import { Footnote } from "./footnote";
import {
  ArrowUpIcon,
  CheckedSquare,
  ChevronDownIcon,
  StopIcon,
  UncheckedSquare,
} from "./icons";
import { Input } from "./input";
import { supabase, ChatMessage } from "@/lib/supabase";

interface ChatProps {
  selectedSessionId?: string | null;
  selectedMessages?: ChatMessage[];
  onNewSession?: () => void;
  onChatUpdate?: () => void;
}

/**
 * Renders an interactive AI chat interface with session management, model selection, and reasoning controls.
 *
 * The Chat component supports authenticated and anonymous sessions, allows users to select AI models, toggle reasoning features, and send messages. It synchronizes chat state with external session and message props, notifies parent components of session and chat updates, and manages user authentication status.
 *
 * @param selectedSessionId - The ID of the chat session to load, or null to start a new session.
 * @param selectedMessages - An array of chat messages to preload into the chat.
 * @param onNewSession - Callback invoked when a new chat session is created.
 * @param onChatUpdate - Callback invoked when the chat updates, such as after receiving a new message or session change.
 */
export function Chat({
  selectedSessionId = null,
  selectedMessages = [],
  onNewSession,
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
        <div className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1 bg-zinc-100">
          <Input
            input={input}
            setInput={setInput}
            selectedModelId={selectedModelId}
            isGeneratingResponse={isGeneratingResponse}
            isReasoningEnabled={isReasoningEnabled}
            onSubmit={handleSendMessage}
          />

          <div className="absolute bottom-2.5 left-2.5">
            <button
              disabled={selectedModelId !== "sonnet-3.7"}
              className={cn(
                "relative w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-2 dark:hover:bg-zinc-600 hover:bg-zinc-200 cursor-pointer disabled:opacity-50",
                {
                  "dark:bg-zinc-600 bg-zinc-200": isReasoningEnabled,
                }
              )}
              onClick={() => {
                setIsReasoningEnabled(!isReasoningEnabled);
              }}
            >
              {isReasoningEnabled ? <CheckedSquare /> : <UncheckedSquare />}
              <div>Reasoning</div>
            </button>
          </div>

          <div className="absolute bottom-2.5 right-2.5 flex flex-row gap-2">
            <div className="relative w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-0.5 dark:hover:bg-zinc-700 hover:bg-zinc-200 cursor-pointer">
              {/* <div>
                {selectedModel ? selectedModel.name : "Models Unavailable!"}
              </div> */}
              <div className="flex justify-center items-center text-zinc-500 dark:text-zinc-400 px-1">
                <span className="pr-1">{models[selectedModelId]}</span>
                <ChevronDownIcon />
              </div>

              <select
                className="absolute opacity-0 w-full p-1 left-0 cursor-pointer"
                value={selectedModelId}
                onChange={(event) => {
                  if (event.target.value !== "sonnet-3.7") {
                    setIsReasoningEnabled(true);
                  }
                  setSelectedModelId(event.target.value as modelID);
                }}
              >
                {Object.entries(models).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={cn(
                "size-8 flex flex-row justify-center items-center dark:bg-zinc-100 bg-zinc-900 dark:text-zinc-900 text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-300 hover:scale-105 active:scale-95 transition-all",
                {
                  "dark:bg-zinc-200 dark:text-zinc-500":
                    isGeneratingResponse || input === "",
                }
              )}
              onClick={() => {
                if (isGeneratingResponse) {
                  stop();
                } else {
                  handleSendMessage();
                }
              }}
            >
              {isGeneratingResponse ? <StopIcon /> : <ArrowUpIcon />}
            </button>
          </div>
        </div>

        <Footnote />
      </div>
    </div>
  );
}
