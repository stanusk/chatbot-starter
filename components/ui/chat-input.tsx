"use client";

import * as React from "react";
import { ErrorHandlers } from "@/lib/error-handling";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/ui/model-selector";
import { ReasoningToggle } from "@/components/ui/reasoning-toggle";
import { ArrowUpIcon, StopIcon } from "@/components/icons";
import { SONNET_3_7_MODEL_ID } from "@/lib/models";
import { cn } from "@/utils";
import type { ChatInputProps } from "@/types/ui";

export function ChatInput({
  input,
  setInput,
  selectedModelId,
  setSelectedModelId,
  isReasoningEnabled,
  setIsReasoningEnabled,
  isGeneratingResponse,
  onSubmit,
  onStop,
}: ChatInputProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (input === "") {
        return;
      }

      if (isGeneratingResponse) {
        ErrorHandlers.validationError(
          "Cannot send message while generating response",
          "Please wait for the model to finish its response!",
          {
            component: "ChatInput",
            action: "handleKeyPress",
          }
        );
        return;
      }

      onSubmit();
    }
  };

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + "px";
    }
  }, [input]);

  return (
    <div className="bg-background border border-border rounded-xl p-3">
      <Textarea
        ref={textareaRef}
        className="resize-none w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none outline-none min-h-[24px] max-h-40 mb-3"
        placeholder="Send a message"
        value={input}
        autoFocus
        onChange={(event) => setInput(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        style={{
          height: "auto",
          lineHeight: "1.5",
        }}
      />

      <div className="flex items-center justify-between">
        <ReasoningToggle
          isEnabled={isReasoningEnabled}
          onToggle={() => setIsReasoningEnabled(!isReasoningEnabled)}
          disabled={selectedModelId !== SONNET_3_7_MODEL_ID}
        />

        <div className="flex gap-2">
          <ModelSelector
            selectedModelId={selectedModelId}
            onModelChange={(modelId) => {
              // Auto-enable reasoning for models other than sonnet-3.7
              // as they support/benefit from reasoning capabilities
              if (modelId !== SONNET_3_7_MODEL_ID) {
                setIsReasoningEnabled(true);
              }
              setSelectedModelId(modelId);
            }}
          />

          <Button
            size="icon"
            className={cn("size-8 rounded-full", {
              "opacity-50": isGeneratingResponse || input === "",
            })}
            onClick={() => {
              if (isGeneratingResponse) {
                onStop();
              } else {
                onSubmit();
              }
            }}
            aria-label={
              isGeneratingResponse ? "Stop generation" : "Send message"
            }
          >
            {isGeneratingResponse ? <StopIcon /> : <ArrowUpIcon />}
          </Button>
        </div>
      </div>
    </div>
  );
}
