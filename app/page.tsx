"use client";

import { Sidebar, MainContent } from "@/components/layout";
import { useAuthContext, useChatContext } from "@/contexts";

export default function Home() {
  const { user } = useAuthContext();
  const {
    selectedSessionId,
    selectedMessages,
    sidebarOpen,
    selectSession,
    startNewChat,
    setSidebarOpen,
    handleChatUpdate,
    handleSessionCreated,
    chatHistoryRef,
  } = useChatContext();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        ref={chatHistoryRef}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onSessionSelect={selectSession}
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
        onNewSession={startNewChat}
        onChatUpdate={handleChatUpdate}
        onSessionCreated={handleSessionCreated}
        onMenuClick={() => setSidebarOpen(true)}
      />
    </div>
  );
}
