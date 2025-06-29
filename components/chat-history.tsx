"use client";

import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useChatHistory } from "@/hooks";
import type { ChatHistoryProps, ChatHistoryRef } from "@/types/components";

export type { ChatHistoryRef };

export const ChatHistory = forwardRef<ChatHistoryRef, ChatHistoryProps>(
  ({ user, onSessionSelect, currentSessionId }, ref) => {
    const {
      sessions,
      loading,
      refreshSessions,
      refreshSessionsSilently,
      handleSessionClick,
      formatDate,
    } = useChatHistory({
      user,
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

        {/* New Chat entry */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSessionSelect?.("", [])}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSessionSelect?.("", []);
            }
          }}
          aria-label="Start a new chat conversation"
          className="p-3 rounded-lg cursor-pointer transition-colors bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">+ New Chat</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Start a new conversation
              </p>
            </div>
          </div>
        </div>

        {sessions.map((session) => (
          <div
            key={session.id}
            role="button"
            tabIndex={0}
            onClick={() => handleSessionClick(session)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSessionClick(session);
              }
            }}
            aria-label={`Open chat session: ${
              session.title && session.title !== "New Chat"
                ? session.title
                : "New Chat"
            }, last updated ${formatDate(session.updated_at)}`}
            aria-pressed={currentSessionId === session.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
              currentSessionId === session.id
                ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">
                  {session.title && session.title !== "New Chat"
                    ? session.title
                    : "New Chat"}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {formatDate(session.updated_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

ChatHistory.displayName = "ChatHistory";
