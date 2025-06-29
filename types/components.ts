/**
 * Component prop types
 */

import { UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import { User } from "@supabase/supabase-js";
import { ChatSession, ChatMessage } from "./database";

// Layout component types
export interface MobileHeaderProps {
  onMenuClick: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSessionSelect: (sessionId: string, messages: ChatMessage[]) => void;
  currentSessionId: string | null;
}

export interface MainContentProps {
  selectedSessionId: string | null;
  selectedMessages: ChatMessage[];
  onNewSession: () => void;
  onChatUpdate: () => void;
  onMenuClick: () => void;
}

// Chat component types
export interface ChatProps {
  selectedSessionId?: string | null;
  selectedMessages?: ChatMessage[];
  onNewSession?: () => void;
  onChatUpdate?: () => void;
}

export interface MessagesProps {
  messages: Array<UIMessage>;
  status: UseChatHelpers["status"];
}

// Message part types
export interface ReasoningPart {
  type: "reasoning";
  reasoning: string;
  details: Array<{ type: "text"; text: string }>;
}

export interface ReasoningMessagePartProps {
  part: ReasoningPart;
  isReasoning: boolean;
}

export interface TextMessagePartProps {
  text: string;
}

// Auth component types - now uses context, no props needed

// Chat history types
export interface ChatHistoryProps {
  user: User | null;
  onSessionSelect?: (sessionId: string, messages: ChatMessage[]) => void;
  currentSessionId?: string | null;
}

export interface ChatHistoryRef {
  refreshSessions: () => void;
  refreshSessionsSilently: () => void;
}

// Input component types
export interface InputProps {
  input: string;
  setInput: (value: string) => void;
  selectedModelId: string;
  isGeneratingResponse: boolean;
  isReasoningEnabled: boolean;
  onSubmit: () => void;
} 