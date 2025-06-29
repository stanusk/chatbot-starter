import { Chat } from "@/components/chat";
import { ChatMessage } from "@/lib/supabase";
import { MobileHeader } from "./mobile-header";

interface MainContentProps {
  selectedSessionId: string | null;
  selectedMessages: ChatMessage[];
  onNewSession: () => void;
  onChatUpdate: () => void;
  onMenuClick: () => void;
}

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
