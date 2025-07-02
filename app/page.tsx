"use client";

import { Sidebar, MainContent } from "@/components/layout";
import { useAuthContext, useChatContext } from "@/contexts";

export default function Home() {
  const { user } = useAuthContext();
  const {
    selectedSessionId,
    selectedMessages,
    sidebarOpen,
    sidebarPinned,
    selectSession,
    startNewChat,
    setSidebarOpen,
    toggleSidebar,
    openSidebar,
    handleChatUpdate,
    handleSessionCreated,
    chatHistoryRef,
  } = useChatContext();

  const handleHoverZoneEnter = () => {
    // Only open on hover for non-touch devices and when not pinned
    if (!window.matchMedia("(pointer: coarse)").matches && !sidebarPinned) {
      openSidebar();
    }
  };

  const handleHoverZoneClick = () => {
    // For touch devices, tap to toggle
    if (window.matchMedia("(pointer: coarse)").matches) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Hover zone for opening sidebar - only when not pinned */}
      {!sidebarPinned && (
        <div
          className="fixed left-0 top-0 bottom-0 w-2 z-30 cursor-pointer"
          onMouseEnter={handleHoverZoneEnter}
          onClick={handleHoverZoneClick}
          aria-label="Open sidebar"
        />
      )}

      <Sidebar
        ref={chatHistoryRef}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onSessionSelect={selectSession}
        currentSessionId={selectedSessionId}
        isPinned={sidebarPinned}
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
        onMenuClick={toggleSidebar}
        sidebarOpen={sidebarOpen}
        sidebarPinned={sidebarPinned}
      />
    </div>
  );
}
