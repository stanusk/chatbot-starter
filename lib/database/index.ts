// Supabase database utilities
export {
  // Server-side functions
  createChatSession,
  saveChatMessage,
  getChatMessages,
  getChatSessions,
  softDeleteChatSession,
  updateChatSessionTitle,
  getChatSession,
  generateChatTitle,
  // Types
  type ChatSession,
  type ChatMessage,
  type MessageRole
} from "./supabase";

// Note: For client-side Supabase operations, import from:
// import { supabaseBrowser } from "@/lib/supabase/client"; 