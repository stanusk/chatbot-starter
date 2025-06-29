/**
 * Chat API handler functions
 * Extracted from the main API route for better organization and maintainability
 */

import { Message } from "ai";
import { saveChatMessage, createChatSession, updateChatSessionTitle, generateChatTitle, getChatMessages } from "@/lib/supabase";
import type { AIStreamResult } from "@/types/api";

/**
 * Session management logic
 */
export async function handleSessionManagement(sessionId: string | undefined, userId: string | undefined): Promise<string | null> {
  // Use the provided session ID - don't create new ones
  let currentSessionId = sessionId;
  
  if (!currentSessionId && userId) {
    try {
      const session = await createChatSession(userId, "New Chat");
      currentSessionId = session.id;
    } catch (error) {
      console.error("Failed to create chat session:", error);
      // Continue without session persistence if Supabase fails
      return null;
    }
  }
  
  return currentSessionId || null;
}

/**
 * Message persistence logic for user messages
 */
export async function handleUserMessagePersistence(
  messages: Message[],
  sessionId: string | null
): Promise<void> {
  if (!sessionId) return;

  const userMessage = messages[messages.length - 1];
  if (!userMessage || userMessage.role !== "user") return;

  try {
    await saveChatMessage(
      sessionId,
      "user",
      userMessage.content,
      undefined,
      undefined,
      { timestamp: userMessage.createdAt }
    );

    // Check if this is the first user message and update title
    const existingMessages = await getChatMessages(sessionId);
    const userMessages = existingMessages.filter(msg => msg.role === "user");
    
    if (userMessages.length === 1) {
      // This is the first user message, generate and update title
      await handleTitleGeneration(sessionId, userMessage.content);
    }
  } catch (error) {
    console.error("Failed to save user message:", error);
  }
}

/**
 * Title generation logic
 */
export async function handleTitleGeneration(sessionId: string, messageContent: string): Promise<void> {
  try {
    const newTitle = generateChatTitle(messageContent);
    await updateChatSessionTitle(sessionId, newTitle);
  } catch (error) {
    console.error("Failed to generate/update chat title:", error);
  }
}

/**
 * Message persistence logic for assistant messages
 */
export async function handleAssistantMessagePersistence(
  sessionId: string | null,
  result: AIStreamResult,
  selectedModelId: string,
  isReasoningEnabled: boolean
): Promise<void> {
  if (!sessionId) return;

  try {
    // Extract reasoning if available
    const reasoning =
      typeof result.experimental_providerMetadata?.anthropic?.thinking === "string"
        ? result.experimental_providerMetadata.anthropic.thinking
        : typeof result.reasoning === "string"
        ? result.reasoning
        : undefined;

    // Calculate a simple score based on response length and reasoning presence
    const score = reasoning
      ? Math.min(100, result.text.length / 10 + 20)
      : Math.min(100, result.text.length / 10);

    await saveChatMessage(
      sessionId,
      "assistant",
      result.text,
      reasoning,
      Math.round(score),
      {
        model: selectedModelId,
        reasoning_enabled: isReasoningEnabled,
        usage: result.usage,
        finish_reason: result.finishReason,
        timestamp: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Failed to save assistant message:", error);
  }
}

/**
 * AI streaming configuration
 */
export function createStreamingConfig(selectedModelId: string, isReasoningEnabled: boolean) {
  const baseConfig = {
    system: "you are a friendly assistant. do not use emojis in your responses.",
  };

  if (selectedModelId === "sonnet-3.7" && isReasoningEnabled === false) {
    return {
      ...baseConfig,
      providerOptions: {
        anthropic: {
          thinking: {
            type: "disabled" as const,
            budgetTokens: 12000,
          },
        },
      },
    };
  }

  return baseConfig;
} 