"use client";

import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useChatHistory } from "@/hooks";
import { useChatContext } from "@/contexts";
import { ChatHistoryItem } from "./chat-history-item";
import type { ChatHistoryProps, ChatHistoryRef } from "@/types/components";

export type { ChatHistoryRef };

export const ChatHistory = forwardRef<ChatHistoryRef, ChatHistoryProps>(
  ({ user, onSessionSelect, currentSessionId }, ref) => {
    const { startNewChat, hasPlaceholder } = useChatContext();
    const {
      sessions,
      loading,
      refreshSessions,
      refreshSessionsSilently,
      handleSessionClick,
      formatDate,
    } = useChatHistory({
      onSessionSelect,
    });

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useImperativeHandle(ref, () => ({
      refreshSessions,
      refreshSessionsSilently,
    }));

    // Don't render user-dependent content until client-side hydration is complete
    if (!isClient) {
      return (
        <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
          Loading...
        </div>
      );
    }

    if (!user) {
      return (
        <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
          Sign in to view your chat history
        </div>
      );
    }

    if (loading) {
      return (
        <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
          Loading chat history...
        </div>
      );
    }

    if (sessions.length === 0) {
      return (
        <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
          No chat history yet. Start a conversation to see it here!
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Chat History</h3>
          <button
            onClick={refreshSessions}
            disabled={loading}
            className="p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50"
            title="Refresh chat history"
          >
            {loading ? "⟳" : "↻"}
          </button>
        </div>

        {/* New Chat Button - Distinct from history items */}
        <button
          onClick={startNewChat}
          aria-label="Start a new chat conversation"
          className="w-full mb-4 px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">+</span>
            <span>New Chat</span>
          </div>
        </button>

        {/* Placeholder entry when hasPlaceholder is true */}
        {hasPlaceholder && currentSessionId === null && (
          <div
            className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">New Chat</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Ready to start
                </p>
              </div>
            </div>
          </div>
        )}

        {sessions.map((session) => (
          <ChatHistoryItem
            key={session.id}
            session={session}
            isSelected={currentSessionId === session.id}
            onClick={() => handleSessionClick(session)}
            formatDate={formatDate}
          />
        ))}
      </div>
    );
  }
);

ChatHistory.displayName = "ChatHistory";
