"use client";

import { toast } from "sonner";

interface InputProps {
  input: string;
  setInput: (value: string) => void;
  selectedModelId: string;
  isGeneratingResponse: boolean;
  isReasoningEnabled: boolean;
  onSubmit: () => void;
}

/**
 * Renders a controlled textarea input for user messages with submission handling.
 *
 * The component updates its value via the provided setter and triggers the `onSubmit` callback when the Enter key is pressed (without Shift), provided the input is non-empty and no response is currently being generated. Displays an error toast if submission is attempted while a response is in progress.
 */
export function Input({
  input,
  setInput,
  selectedModelId,
  isGeneratingResponse,
  isReasoningEnabled,
  onSubmit,
}: InputProps) {

  return (
    <textarea
      className="mb-12 resize-none w-full min-h-12 outline-none bg-transparent placeholder:text-zinc-400"
      placeholder="Send a message"
      value={input}
      autoFocus
      onChange={(event) => {
        setInput(event.currentTarget.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          if (input === "") {
            return;
          }

          if (isGeneratingResponse) {
            toast.error("Please wait for the model to finish its response!");
            return;
          }

          onSubmit();
        }
      }}
    />
  );
}
