import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatSession, ChatMessage, MessageRole } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables not found. Some features may not work."
  );
}

// Note: Browser client moved to lib/supabase/client.ts for SSR compatibility
// Use supabaseBrowser from @/lib/supabase/client for client-side operations

// Admin client removed - using RLS-based security with authenticated clients
// All operations now go through API routes with proper authentication

// Re-export database types from centralized types for backward compatibility
export type { ChatSession, ChatMessage, MessageRole } from "@/types/database";

// Helper functions using RLS-based security
// These functions now accept a supabase client instance from the calling API route
export async function createChatSession(
  supabase: SupabaseClient,
  title?: string
): Promise<ChatSession> {
  // Get current user - RLS will automatically set user_id based on auth context
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) throw authError;

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      user_id: user?.id || null, // Use authenticated user ID or null for anonymous
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
  supabase: SupabaseClient,
  sessionId: string,
  role: MessageRole,
  content: string,
  reasoning?: string,
  score?: number,
  metadata?: Record<string, unknown>
): Promise<ChatMessage> {
  const { data, error } = await supabase
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
  const { error: updateError } = await supabase
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (updateError) throw updateError;

  return data;
}

export async function getChatMessages(
  supabase: SupabaseClient,
  sessionId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getChatSessions(
  supabase: SupabaseClient
): Promise<ChatSession[]> {
  // RLS policies will automatically filter sessions based on authenticated user
  // RLS also handles trash filtering, so no manual filtering needed
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function softDeleteChatSession(
  supabase: SupabaseClient,
  sessionId: string
): Promise<void> {
  const { error } = await supabase
    .from("chat_sessions")
    .update({ 
      trash: true,
      updated_at: new Date().toISOString() 
    })
    .eq("id", sessionId);

  if (error) throw error;
  // RLS will ensure only the owner can delete their sessions
}

export async function updateChatSessionTitle(
  supabase: SupabaseClient,
  sessionId: string,
  title: string
): Promise<void> {
  const { error } = await supabase
    .from("chat_sessions")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) throw error;
}

export async function getChatSession(
  supabase: SupabaseClient,
  sessionId: string
): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
      // No rows returned or user doesn't have access (RLS filtered it out)
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
