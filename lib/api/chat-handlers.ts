/**
 * Chat API handler functions
 * Extracted from the main API route for better organization and maintainability
 */

import { Message, generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { saveChatMessage, createChatSession, updateChatSessionTitle, generateChatTitle, getChatMessages, getChatSession } from "@/lib/database";
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
    // Save the user message
    await saveChatMessage(
      sessionId,
      "user",
      userMessage.content,
      undefined,
      undefined,
      { timestamp: userMessage.createdAt }
    );
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
 * AI-powered title generation logic with fallback
 */
export async function handleTitleGeneration(sessionId: string, userMessage: string, assistantMessage: string): Promise<void> {
  try {
    let newTitle: string;
    
    try {
      // Use cheapest Anthropic model (Claude 3 Haiku) for title generation
      const result = await generateText({
        model: anthropic("claude-3-haiku-20240307"),
        messages: [
          {
            role: "user",
            content: `Generate a very brief title (2-3 words maximum) for this conversation. Use the same language as the user's message.

User: ${userMessage}
Assistant: ${assistantMessage}

Examples:
- If about coding: "Python Help" or "Code Debug"
- If about food: "Recipe Tips" or "Cooking Ideas"  
- If about travel: "Trip Planning" or "Travel Guide"
- If user writes in Spanish: "Ayuda Python" or "Recetas Fáciles"
- If user writes in French: "Aide Python" or "Recettes Faciles"

Return only 2-3 words, no quotes, same language as user.`
          }
        ],
        maxTokens: 10,
        temperature: 0.1
      });
      
      newTitle = result.text.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
      
    } catch (aiError) {
      // Fallback to truncation method if AI fails
      ErrorHandlers.aiProviderError("AI title generation failed, using fallback", aiError, {
        sessionId,
        component: "handleTitleGeneration",
        action: "generateText"
      });
      // For fallback, just take first few words without truncation dots
      const words = userMessage.trim().split(/\s+/).slice(0, 3);
      newTitle = words.join(' ');
    }
    
    await updateChatSessionTitle(sessionId, newTitle);
  } catch (error) {
    ErrorHandlers.supabaseError("Failed to update chat title", error, {
      sessionId,
      component: "handleTitleGeneration",
      action: "updateChatSessionTitle"
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
  isReasoningEnabled: boolean,
  userMessageContent?: string
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

    // Check if we should generate an AI title (only for sessions that still have "New Chat" title)
    try {
      const session = await getChatSession(sessionId);
      
      // Only generate title if session still has "New Chat" title (indicating first conversation)
      if (session && session.title === "New Chat") {
        // Use the provided user message content if available
        if (userMessageContent) {
          // Generate AI title using the user message and this assistant response
          await handleTitleGeneration(sessionId, userMessageContent, result.text);
        } else {
          // Fallback: Get the first user message from database
          const messages = await getChatMessages(sessionId);
          const userMessages = messages.filter(msg => msg.role === "user");
          
          if (userMessages.length > 0) {
            await handleTitleGeneration(sessionId, userMessages[0].content, result.text);
          }
        }
      }
    } catch (titleError) {
      // Don't fail the whole operation if title generation fails
      ErrorHandlers.supabaseError("Failed to generate AI title after assistant response", titleError, {
        sessionId,
        component: "handleAssistantMessagePersistence",
        action: "handleTitleGeneration"
      });
    }
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