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

/**
 * Creates a new chat session with an optional user ID and title.
 *
 * @param userId - The user ID to associate with the session, or undefined for an anonymous session
 * @param title - The title of the chat session; defaults to "New Chat" if not provided
 * @returns The newly created chat session
 * @throws If the Supabase admin client is not initialized or the database operation fails
 */
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

/**
 * Saves a new chat message to the specified session and updates the session's last modified timestamp.
 *
 * @param sessionId - The ID of the chat session to associate with the message.
 * @param role - The role of the message sender ("user", "assistant", or "system").
 * @param content - The content of the chat message.
 * @param reasoning - Optional reasoning or explanation for the message.
 * @param score - Optional score or rating for the message.
 * @param metadata - Optional additional metadata for the message.
 * @returns The newly saved chat message.
 * @throws If the Supabase admin client is not initialized or if the database operation fails.
 */
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

  // Update the session's updated_at timestamp
  await supabaseAdmin
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

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

/**
 * Retrieves chat sessions for a user or anonymous sessions.
 *
 * If a user ID is provided, returns sessions belonging to that user or sessions with no associated user (anonymous). If no user ID is given, returns only anonymous sessions.
 *
 * @param userId - The user ID to filter sessions by, or undefined to fetch only anonymous sessions
 * @returns An array of chat sessions matching the criteria
 */
export async function getChatSessions(userId?: string): Promise<ChatSession[]> {
  if (!supabase) {
    throw new Error("Supabase client not initialized");
  }

  let query = supabase
    .from("chat_sessions")
    .select("*")
    .order("updated_at", { ascending: false });

  if (userId) {
    // Get sessions for this user OR sessions with null user_id (anonymous sessions)
    query = query.or(`user_id.eq.${userId},user_id.is.null`);
  } else {
    // If no userId provided, only get sessions with null user_id
    query = query.is("user_id", null);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Updates the title and last updated timestamp of a chat session.
 *
 * @param sessionId - The unique identifier of the chat session to update
 * @param title - The new title for the chat session
 */
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

/**
 * Generates a concise chat title from the first user message.
 *
 * Trims whitespace, replaces newlines with spaces, and truncates the message to a maximum of 50 characters, attempting to cut at a word boundary. Appends an ellipsis if the title is truncated.
 *
 * @param firstMessage - The initial user message to generate a title from
 * @returns A cleaned and truncated chat title
 */
export function generateChatTitle(firstMessage: string): string {
  // Clean and truncate the message for a title
  const cleaned = firstMessage.trim().replace(/\n/g, ' ');
  const maxLength = 50;
  
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
