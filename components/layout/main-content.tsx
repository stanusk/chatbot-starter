import { Chat } from "@/components/chat";
import { MobileHeader } from "./mobile-header";
import type { MainContentProps } from "@/types/components";

export function MainContent({
  selectedSessionId,
  selectedMessages,
  onNewSession,
  onChatUpdate,
  onMenuClick,
}: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col lg:ml-0">
      <MobileHeader onMenuClick={onMenuClick} />

      <div className="flex-1 flex justify-center">
        <Chat
          selectedSessionId={selectedSessionId}
          selectedMessages={selectedMessages}
          onNewSession={onNewSession}
          onChatUpdate={onChatUpdate}
        />
      </div>
    </div>
  );
}
