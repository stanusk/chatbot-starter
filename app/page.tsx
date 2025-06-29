"use client";

import { useState, useRef } from "react";
import { Sidebar, MainContent } from "@/components/layout";
import { ChatHistoryRef } from "@/components/chat-history";
import { User } from "@supabase/supabase-js";
import { ChatMessage } from "@/lib/supabase";

const NEW_CHAT_ID = "";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);
  const chatHistoryRef = useRef<ChatHistoryRef>(null);

  const handleAuthChange = (newUser: User | null) => {
    setUser(newUser);
  };

  const handleSessionSelect = (sessionId: string, messages: ChatMessage[]) => {
    if (sessionId === NEW_CHAT_ID) {
      // Handle "New Chat" selection
      handleNewChat();
    } else {
      setSelectedSessionId(sessionId);
      setSelectedMessages(messages);
    }
    // Close sidebar on mobile when a session is selected
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    // Start a new chat - let the API create the session when first message is sent
    setSelectedSessionId(null);
    setSelectedMessages([]);
  };

  const handleChatUpdate = () => {
    // Silently refresh chat history when new messages are sent (avoids blinking)
    if (chatHistoryRef.current) {
      chatHistoryRef.current.refreshSessionsSilently();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        ref={chatHistoryRef}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onAuthChange={handleAuthChange}
        onSessionSelect={handleSessionSelect}
        currentSessionId={selectedSessionId}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <MainContent
        selectedSessionId={selectedSessionId}
        selectedMessages={selectedMessages}
        onNewSession={handleNewChat}
        onChatUpdate={handleChatUpdate}
        onMenuClick={() => setSidebarOpen(true)}
      />
    </div>
  );
}
