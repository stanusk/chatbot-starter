/**
 * Database types for Supabase schema
 */

export interface ChatSession {
  id: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  reasoning?: string;
  score?: number;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export type MessageRole = "user" | "assistant" | "system"; 