/**
 * API request/response types
 */

import { Message } from "ai";

// Chat API types - using legacy modelID type for backward compatibility
export interface ChatRequestBody {
  messages: Array<Message>;
  selectedModelId: string; // Using string to match current API implementation
  isReasoningEnabled: boolean;
  sessionId?: string;
  userId?: string;
}

export interface ChatResponseHeaders {
  "X-Session-ID": string;
}

// Error response types
export interface ApiErrorResponse {
  error: string;
  message?: string;
  code?: string;
}

// Success response types
export interface ApiSuccessResponse<T = unknown> {
  data: T;
  message?: string;
} 