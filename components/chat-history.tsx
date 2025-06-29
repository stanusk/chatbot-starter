"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getChatSessions, getChatMessages } from "@/lib/supabase";
import type { ChatSession, ChatMessage } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface ChatHistoryProps {
  user: User | null;
  onSessionSelect?: (sessionId: string, messages: ChatMessage[]) => void;
  currentSessionId?: string | null;
}

export interface ChatHistoryRef {
  refreshSessions: () => void;
  refreshSessionsSilently: () => void;
}

export const ChatHistory = forwardRef<ChatHistoryRef, ChatHistoryProps>(
  ({ user, onSessionSelect, currentSessionId }, ref) => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (user) {
        loadSessions();
      } else {
        setSessions([]);
      }
    }, [user]);

    const loadSessions = async (showLoading = true) => {
      if (!user) return;

      if (showLoading) {
        setLoading(true);
      }
      try {
        const userSessions = await getChatSessions(user.id);
        setSessions(userSessions);
      } catch (error) {
        console.error("Failed to load chat sessions:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Failed to load chat history: ${errorMessage}`);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    };

    // Expose refresh function for external use
    const refreshSessions = () => {
      if (user) {
        loadSessions();
      }
    };

    // Silent refresh without loading state (for frequent updates)
    const refreshSessionsSilently = () => {
      if (user) {
        loadSessions(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refreshSessions,
      refreshSessionsSilently,
    }));

    const handleSessionClick = async (session: ChatSession) => {
      if (onSessionSelect) {
        try {
          const messages = await getChatMessages(session.id);
          onSessionSelect(session.id, messages);
        } catch (error) {
          console.error("Failed to load chat messages:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          toast.error(`Failed to load chat messages: ${errorMessage}`);
        }
      }
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInHours < 24 * 7) {
        return `${Math.floor(diffInHours / 24)}d ago`;
      } else {
        return date.toLocaleDateString();
      }
    };

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
          onClick={() => onSessionSelect && onSessionSelect("", [])}
          className="p-3 rounded-lg cursor-pointer transition-colors bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
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
            onClick={() => handleSessionClick(session)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              currentSessionId === session.id
                ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">
                  {session.title && session.title !== "New Chat" ? session.title : "New Chat"}
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
