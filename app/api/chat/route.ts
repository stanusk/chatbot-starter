import { modelID, myProvider } from "@/lib/models";
import { Message, smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";
import { saveChatMessage, createChatSession, updateChatSessionTitle, generateChatTitle, getChatMessages } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const {
    messages,
    selectedModelId,
    isReasoningEnabled,
    sessionId,
    userId,
  }: {
    messages: Array<Message>;
    selectedModelId: modelID;
    isReasoningEnabled: boolean;
    sessionId?: string;
    userId?: string;
  } = await request.json();

  // Use the provided session ID - don't create new ones
  let currentSessionId = sessionId;
  if (!currentSessionId) {
    try {
      const session = await createChatSession(userId, "New Chat");
      currentSessionId = session.id;
    } catch (error) {
      console.error("Failed to create chat session:", error);
      // Continue without session persistence if Supabase fails
    }
  }

  // Save the user's message to Supabase
  const userMessage = messages[messages.length - 1];
  if (userMessage && userMessage.role === "user" && currentSessionId) {
    try {
      await saveChatMessage(
        currentSessionId,
        "user",
        userMessage.content,
        undefined,
        undefined,
        { timestamp: userMessage.createdAt }
      );

      // Check if this is the first user message and update title
      const existingMessages = await getChatMessages(currentSessionId);
      const userMessages = existingMessages.filter(msg => msg.role === "user");
      
      if (userMessages.length === 1) {
        // This is the first user message, generate and update title
        const newTitle = generateChatTitle(userMessage.content);
        await updateChatSessionTitle(currentSessionId, newTitle);
      }
    } catch (error) {
      console.error("Failed to save user message:", error);
    }
  }

  const stream = streamText({
    system:
      "you are a friendly assistant. do not use emojis in your responses.",
    providerOptions:
      selectedModelId === "sonnet-3.7" && isReasoningEnabled === false
        ? {
            anthropic: {
              thinking: {
                type: "disabled",
                budgetTokens: 12000,
              },
            },
          }
        : {},
    model: myProvider.languageModel(selectedModelId),
    experimental_transform: [
      smoothStream({
        chunking: "word",
      }),
    ],
    messages,
    onFinish: async (result) => {
      // Save the assistant's response to Supabase after completion
      if (currentSessionId) {
        try {
          // Extract reasoning if available
          const reasoning =
            typeof result.experimental_providerMetadata?.anthropic?.thinking ===
            "string"
              ? result.experimental_providerMetadata.anthropic.thinking
              : typeof result.reasoning === "string"
              ? result.reasoning
              : undefined;

          // Calculate a simple score based on response length and reasoning presence
          const score = reasoning
            ? Math.min(100, result.text.length / 10 + 20)
            : Math.min(100, result.text.length / 10);

          await saveChatMessage(
            currentSessionId,
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
    },
  });

  
  return stream.toDataStreamResponse({
    sendReasoning: true,
    getErrorMessage: () => {
      return `An error occurred, please try again!`;
    },
    headers: {
      // Include session ID in response headers for client-side tracking
      "X-Session-ID": currentSessionId || "",
    },
  });
}
