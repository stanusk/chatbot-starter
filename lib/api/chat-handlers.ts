/**
 * Chat API handler functions
 * Extracted from the main API route for better organization and maintainability
 */

import { Message } from "ai";
import { saveChatMessage, createChatSession, updateChatSessionTitle, generateChatTitle, getChatMessages } from "@/lib/database";
import type { AIStreamResult } from "@/types/api";
import { ErrorHandlers } from "@/lib/error-handling";

/**
 * Session management logic
 */
export async function handleSessionManagement(sessionId: string | undefined, userId: string | undefined): Promise<string | null> {
  // If session ID provided, use it
  if (sessionId) {
    return sessionId;
  }
  
  // Only create new session if we have a user
  if (userId) {
    try {
      const session = await createChatSession(userId, "New Chat");
      return session.id;
    } catch (error) {
      ErrorHandlers.supabaseError("Failed to create chat session", error, {
        userId,
        component: "handleSessionManagement",
        action: "createChatSession"
      });
    }
  }
  
  return null;
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
    // Get existing messages to check if this is the first user message
    const existingMessages = await getChatMessages(sessionId);
    const isFirstUserMessage = !existingMessages.some(msg => msg.role === "user");

    // Save the user message
    await saveChatMessage(
      sessionId,
      "user",
      userMessage.content,
      undefined,
      undefined,
      { timestamp: userMessage.createdAt }
    );

    // Generate title if this is the first user message
    if (isFirstUserMessage) {
      await handleTitleGeneration(sessionId, userMessage.content);
    }
  } catch (error) {
    ErrorHandlers.supabaseError("Failed to save user message", error, {
      sessionId,
      component: "handleUserMessagePersistence",
      action: "saveChatMessage",
      metadata: { messageRole: "user" }
    });
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
    ErrorHandlers.supabaseError("Failed to generate/update chat title", error, {
      sessionId,
      component: "handleTitleGeneration",
      action: "updateChatSessionTitle",
      metadata: { messageContent: messageContent.substring(0, 100) }
    });
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
    ErrorHandlers.supabaseError("Failed to save assistant message", error, {
      sessionId,
      component: "handleAssistantMessagePersistence",
      action: "saveChatMessage",
      metadata: { 
        messageRole: "assistant",
        selectedModelId,
        isReasoningEnabled,
        responseLength: result.text?.length 
      }
    });
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