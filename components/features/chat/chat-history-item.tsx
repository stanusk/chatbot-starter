"use client";

import { useState, useEffect } from "react";
import { useTypewriterEffect } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ChatSession } from "@/lib/database";

interface ChatHistoryItemProps {
  session: ChatSession;
  isSelected: boolean;
  onClick: () => void;
  formatDate: (dateString: string) => string;
  onDelete?: (sessionId: string) => Promise<void>;
}

export function ChatHistoryItem({
  session,
  isSelected,
  onClick,
  formatDate,
  onDelete,
}: ChatHistoryItemProps) {
  const [previousTitle, setPreviousTitle] = useState(session.title);
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Detect when title changes from "New Chat" to something else
  useEffect(() => {
    if (
      previousTitle === "New Chat" &&
      session.title !== "New Chat" &&
      session.title
    ) {
      setShowTypewriter(true);
      // Stop typewriter effect after animation completes
      const timer = setTimeout(() => {
        setShowTypewriter(false);
      }, (session.title || "").length * 50 + 500); // 50ms per character + 500ms buffer

      return () => clearTimeout(timer);
    }
    setPreviousTitle(session.title);
  }, [session.title, previousTitle]);

  // Prevent sidebar from closing when dropdown is open
  useEffect(() => {
    if (dropdownOpen) {
      // Add a data attribute to the body to signal that a dropdown is open
      document.body.setAttribute("data-dropdown-open", "true");
    } else {
      document.body.removeAttribute("data-dropdown-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.removeAttribute("data-dropdown-open");
    };
  }, [dropdownOpen]);

  const { displayText, isComplete } = useTypewriterEffect({
    text:
      showTypewriter && session.title !== "New Chat" ? session.title || "" : "",
    speed: 50,
    delay: 100,
  });

  const displayTitle =
    showTypewriter && !isComplete
      ? displayText
      : session.title && session.title !== "New Chat"
      ? session.title
      : "New Chat";

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(session.id);
      toast.success("Session deleted successfully");
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete session. Please try again.");
    } finally {
      setIsDeleting(false);
      setDialogOpen(false);
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Open chat session: ${
        session.title && session.title !== "New Chat"
          ? session.title
          : "New Chat"
      }, last updated ${formatDate(session.updated_at)}`}
      aria-pressed={isSelected}
      className={`group relative p-3 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
        isSelected
          ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
          : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">
            {displayTitle}
            {showTypewriter && !isComplete && (
              <span className="animate-pulse ml-1">|</span>
            )}
          </h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {formatDate(session.updated_at)}
          </p>
        </div>

        {onDelete && (
          <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMoreClick}
                  className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete Chat Session</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{displayTitle}"? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
