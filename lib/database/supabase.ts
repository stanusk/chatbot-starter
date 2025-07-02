import { createClient } from "@supabase/supabase-js";
import type { ChatSession, ChatMessage, MessageRole } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables not found. Some features may not work."
  );
}

// Client for browser/client-side operations
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Admin client for server-side operations with elevated permissions
export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

// Re-export database types from centralized types for backward compatibility
export type { ChatSession, ChatMessage, MessageRole } from "@/types/database";

// Helper functions
// Note: Using supabaseAdmin for session/message operations to ensure
// reliable data persistence regardless of user authentication state.
// This bypasses RLS and should only be used in server-side contexts.
export async function createChatSession(
  userId?: string,
  title?: string
): Promise<ChatSession> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not initialized");
  }

  const { data, error } = await supabaseAdmin
    .from("chat_sessions")
    .insert({
      user_id: userId,
      title: title || "New Chat",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveChatMessage(
  sessionId: string,
  role: MessageRole,
  content: string,
  reasoning?: string,
  score?: number,
  metadata?: Record<string, unknown>
): Promise<ChatMessage> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not initialized");
  }

  const { data, error } = await supabaseAdmin
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      role,
      content,
      reasoning,
      score,
      metadata,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  // Update the session's updated_at timestamp
  const { error: updateError } = await supabaseAdmin
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (updateError) throw updateError;

  return data;
}

export async function getChatMessages(
  sessionId: string
): Promise<ChatMessage[]> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not initialized");
  }

  const { data, error } = await supabaseAdmin
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getChatSessions(userId?: string): Promise<ChatSession[]> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not initialized");
  }

  let query = supabaseAdmin
    .from("chat_sessions")
    .select("*")
    .eq("trash", false) // Exclude trashed sessions
    .order("updated_at", { ascending: false });

  if (userId) {
    // Get sessions only for this specific user
    query = query.eq("user_id", userId);
  } else {
    // If no userId provided, only get sessions with null user_id (anonymous sessions)
    query = query.is("user_id", null);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function softDeleteChatSession(sessionId: string): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not initialized");
  }

  const { error } = await supabaseAdmin
    .from("chat_sessions")
    .update({ 
      trash: true,
      updated_at: new Date().toISOString() 
    })
    .eq("id", sessionId);

  if (error) throw error;
}

export async function updateChatSessionTitle(
  sessionId: string,
  title: string
): Promise<void> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not initialized");
  }

  const { error } = await supabaseAdmin
    .from("chat_sessions")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) throw error;
}

export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client not initialized");
  }

  const { data, error } = await supabaseAdmin
    .from("chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
      // No rows returned
      return null;
    }
    throw error;
  }

  return data;
}

// Generate a chat title from the first user message
export function generateChatTitle(firstMessage: string, maxLength: number = 50): string {
  // Clean and truncate the message for a title
  const cleaned = firstMessage.trim().replace(/\n/g, ' ');
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  // Try to cut at a word boundary
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}
