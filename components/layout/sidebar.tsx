import { forwardRef, useEffect, useRef } from "react";
import { Auth, ChatHistory } from "@/components/features";
import { cn } from "@/utils";
import { useChatContext } from "@/contexts";
import type { SidebarProps, ChatHistoryRef } from "@/types/components";

const getSidebarClasses = (isOpen: boolean) => {
  return cn(
    "fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border",
    "transform transition-transform duration-300 ease-in-out",
    isOpen ? "translate-x-0" : "-translate-x-full"
  );
};

export const Sidebar = forwardRef<ChatHistoryRef, SidebarProps>(
  (
    {
      isOpen,
      onClose,
      user,
      onSessionSelect,
      currentSessionId,
      isPinned = false,
    },
    ref
  ) => {
    const { closeSidebar } = useChatContext();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isOpen && sidebarRef.current) {
          // Check if focus is within sidebar
          const activeElement = document.activeElement;
          if (sidebarRef.current.contains(activeElement)) {
            closeSidebar();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeSidebar]);

    const handleSidebarLeave = () => {
      // Only close if not on touch device and not pinned
      if (window.matchMedia("(pointer: coarse)").matches || isPinned) {
        return;
      }

      // Don't close if a dropdown is currently open
      if (document.body.hasAttribute("data-dropdown-open")) {
        return;
      }

      // Add a delay before closing to allow for dropdown interactions
      closeTimeoutRef.current = setTimeout(() => {
        // Double-check that no dropdown is open when the timeout executes
        if (!document.body.hasAttribute("data-dropdown-open")) {
          closeSidebar();
        }
      }, 300); // 300ms delay
    };

    const handleSidebarEnter = () => {
      // Cancel any pending close when mouse re-enters sidebar
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={sidebarRef}
        className={getSidebarClasses(isOpen)}
        onMouseLeave={handleSidebarLeave}
        onMouseEnter={handleSidebarEnter}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border min-h-[73px]">
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
