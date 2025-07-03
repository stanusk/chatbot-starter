import { Chat } from "@/components/features";
import { MobileHeader } from "./mobile-header";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import type { MainContentProps } from "@/types/components";

export function MainContent({
  selectedSessionId,
  selectedMessages,
  onNewSession,
  onChatUpdate,
  onMenuClick,
  onSessionCreated,
  sidebarOpen = false,
  sidebarPinned = false,
}: MainContentProps) {
  // Adjust main content positioning when sidebar is pinned and open
  const mainContentClasses =
    sidebarPinned && sidebarOpen
      ? "flex-1 flex flex-col ml-80" // Push content right when sidebar is pinned open
      : "flex-1 flex flex-col";

  return (
    <div className={mainContentClasses}>
      <MobileHeader onMenuClick={onMenuClick} />

      {/* Desktop header with sidebar toggle */}
      <div className="hidden lg:flex items-center justify-between p-4 border-b border-border bg-background min-h-[73px]">
        <Button
          variant="outline"
          size="sm"
          onClick={onMenuClick}
          className="p-2 h-9 w-9 bg-background shadow-sm border hover:bg-accent hover:text-accent-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">AI SDK Reasoning</h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 flex justify-center">
        <Chat
          selectedSessionId={selectedSessionId}
          selectedMessages={selectedMessages}
          onNewSession={onNewSession}
          onChatUpdate={onChatUpdate}
          onSessionCreated={onSessionCreated}
        />
      </div>
    </div>
  );
}
