import { myProvider } from "@/lib/models";
import { smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";
import { 
  handleSessionManagement, 
  handleUserMessagePersistence, 
  handleAssistantMessagePersistence, 
  createStreamingConfig 
} from "@/lib/api";
import type { ChatRequestBody } from "@/types/api";

export async function POST(request: NextRequest) {
  const {
    messages,
    selectedModelId,
    isReasoningEnabled,
    sessionId,
    userId,
  }: ChatRequestBody = await request.json();

  // Handle session management
  const currentSessionId = await handleSessionManagement(sessionId, userId);

  // Handle user message persistence
  await handleUserMessagePersistence(messages, currentSessionId);

  const streamingConfig = createStreamingConfig(selectedModelId, isReasoningEnabled);
  
  const stream = streamText({
    ...streamingConfig,
    model: myProvider.languageModel(selectedModelId),
    experimental_transform: [
      smoothStream({
        chunking: "word",
      }),
    ],
    messages,
    onFinish: async (result) => {
      // Get the last user message for title generation
      const lastUserMessage = messages[messages.length - 1];
      const userMessageContent = lastUserMessage?.role === "user" ? lastUserMessage.content : undefined;
      
      // Handle assistant message persistence
      await handleAssistantMessagePersistence(
        currentSessionId,
        result,
        selectedModelId,
        isReasoningEnabled,
        userMessageContent
      );
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
