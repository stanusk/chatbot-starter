"use client";

import { useState, useEffect } from "react";
import { getChatSessions, getChatMessages } from "@/lib/supabase";
import type { ChatSession, ChatMessage } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface ChatHistoryProps {
  user: User | null;
  onSessionSelect?: (sessionId: string, messages: ChatMessage[]) => void;
}

export function ChatHistory({ user, onSessionSelect }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (user) {
      loadSessions();
    } else {
      setSessions([]);
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userSessions = await getChatSessions(user.id);
      setSessions(userSessions);
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to load chat history: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = async (session: ChatSession) => {
    if (selectedSessionId === session.id) {
      setSelectedSessionId(null);
      return;
    }

    setSelectedSessionId(session.id);

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
      <h3 className="text-lg font-medium mb-4">Chat History</h3>
      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => handleSessionClick(session)}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedSessionId === session.id
              ? "bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">
                {session.title || "Untitled Chat"}
              </h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {formatDate(session.updated_at)}
              </p>
            </div>
            <div className="ml-2 text-xs text-zinc-400 dark:text-zinc-500">
              {selectedSessionId === session.id ? "▼" : "▶"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
