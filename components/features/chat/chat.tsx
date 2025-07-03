"use client";

import cn from "classnames";
import { useChat } from "@/hooks";
import { Messages } from "./messages";
import { Footnote } from "@/components/footnote";
import { ChatInput } from "@/components/ui";
import type { ChatProps } from "@/types/components";

export function Chat({
  selectedSessionId = null,
  selectedMessages = [],
  onChatUpdate,
  onSessionCreated,
}: ChatProps) {
  const {
    input,
    setInput,
    selectedModelId,
    setSelectedModelId,
    isReasoningEnabled,
    setIsReasoningEnabled,
    userId,
    isClient,
    messages,
    status,
    isGeneratingResponse,
    sendMessage,
    editMessage,
    stop,
  } = useChat({
    selectedSessionId,
    selectedMessages,
    onChatUpdate,
    onSessionCreated,
  });

  return (
    <div
      className={cn(
        "px-4 md:px-0 pb-4 pt-8 flex flex-col items-center w-full max-w-3xl",
        "h-[calc(100vh-73px)]", // Subtract header height (73px from min-h-[73px])
        {
          "justify-between": messages.length > 0,
          "justify-center gap-4": messages.length === 0,
        }
      )}
    >
      {messages.length > 0 ? (
        <Messages
          messages={messages}
          status={status}
          onEditMessage={editMessage}
        />
      ) : (
        <div className="flex flex-col gap-0.5 sm:text-2xl text-xl w-full">
          <div className="flex flex-row gap-2 items-center">
            <div>Welcome to the AI SDK Reasoning Preview.</div>
          </div>
          <div className="dark:text-zinc-500 text-zinc-400">
            What would you like me to think about today?
          </div>
          {isClient && userId && (
            <div
              className="text-sm dark:text-zinc-600 text-zinc-500 mt-2"
              suppressHydrationWarning
            >
              Signed in • Messages are being saved to your account
            </div>
          )}
          {isClient && !userId && (
            <div
              className="text-sm dark:text-zinc-600 text-zinc-500 mt-2"
              suppressHydrationWarning
            >
              Anonymous session • Messages are saved temporarily
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        <ChatInput
          input={input}
          setInput={setInput}
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
          isReasoningEnabled={isReasoningEnabled}
          setIsReasoningEnabled={setIsReasoningEnabled}
          isGeneratingResponse={isGeneratingResponse}
          onSubmit={sendMessage}
          onStop={stop}
        />

        <Footnote />
      </div>
    </div>
  );
}
