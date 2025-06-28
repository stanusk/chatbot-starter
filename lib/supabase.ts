import { createClient } from "@supabase/supabase-js";

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

// Database types
export interface ChatSession {
  id: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  title?: string;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  reasoning?: string;
  score?: number;
  created_at: string;
  metadata?: Record<string, any>;
}

// Helper functions
export async function createChatSession(
  userId?: string,
  title?: string
): Promise<ChatSession> {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  const { data, error } = await supabase
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
  role: "user" | "assistant" | "system",
  content: string,
  reasoning?: string,
  score?: number,
  metadata?: Record<string, any>
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
  return data;
}

export async function getChatMessages(
  sessionId: string
): Promise<ChatMessage[]> {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getChatSessions(userId?: string): Promise<ChatSession[]> {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  let query = supabase
    .from("chat_sessions")
    .select("*")
    .order("updated_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}
