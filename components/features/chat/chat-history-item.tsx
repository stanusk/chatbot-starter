"use client";

import { useState, useEffect } from "react";
import { useTypewriterEffect } from "@/hooks/useTypewriterEffect";
import type { ChatSession } from "@/lib/database";

interface ChatHistoryItemProps {
  session: ChatSession;
  isSelected: boolean;
  onClick: () => void;
  formatDate: (dateString: string) => string;
}

export function ChatHistoryItem({ 
  session, 
  isSelected, 
  onClick, 
  formatDate 
}: ChatHistoryItemProps) {
  const [previousTitle, setPreviousTitle] = useState(session.title);
  const [showTypewriter, setShowTypewriter] = useState(false);
  
  // Detect when title changes from "New Chat" to something else
  useEffect(() => {
    if (previousTitle === "New Chat" && session.title !== "New Chat" && session.title) {
      setShowTypewriter(true);
      // Stop typewriter effect after animation completes
      const timer = setTimeout(() => {
        setShowTypewriter(false);
      }, session.title.length * 50 + 500); // 50ms per character + 500ms buffer
      
      return () => clearTimeout(timer);
    }
    setPreviousTitle(session.title);
  }, [session.title, previousTitle]);

  const { displayText, isComplete } = useTypewriterEffect({
    text: showTypewriter && session.title !== "New Chat" ? session.title : "",
    speed: 50,
    delay: 100
  });

  const displayTitle = showTypewriter && !isComplete 
    ? displayText 
    : (session.title && session.title !== "New Chat" ? session.title : "New Chat");

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
      className={`p-3 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
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
      </div>
    </div>
  );
}