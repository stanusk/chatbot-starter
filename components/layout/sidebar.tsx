import { forwardRef } from "react";
import { Auth } from "@/components/auth";
import { ChatHistory } from "@/components/chat-history";
import { cn } from "@/lib/utils";
import type { SidebarProps, ChatHistoryRef } from "@/types/components";

const getSidebarClasses = (isOpen: boolean) => {
  return cn(
    "fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border",
    "transform transition-transform duration-300 ease-in-out",
    "lg:translate-x-0 lg:static lg:inset-0",
    isOpen ? "translate-x-0" : "-translate-x-full"
  );
};

export const Sidebar = forwardRef<ChatHistoryRef, SidebarProps>(
  ({ isOpen, onClose, user, onSessionSelect, currentSessionId }, ref) => {
    return (
      <div className={getSidebarClasses(isOpen)}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">AI Chat</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-accent hover:text-accent-foreground"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          <div className="p-4 border-b border-border">
            <Auth />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ChatHistory
              ref={ref}
              user={user}
              onSessionSelect={onSessionSelect}
              currentSessionId={currentSessionId}
            />
          </div>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";
