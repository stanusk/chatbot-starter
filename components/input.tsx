"use client";

import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import type { InputProps } from "@/types/components";

export function Input({
  input,
  setInput,
  isGeneratingResponse,
  onSubmit,
}: InputProps) {
  return (
    <Textarea
      className="resize-none w-full min-h-16 pr-20 pl-28 pb-12 pt-4 border-0 bg-transparent focus-visible:ring-0"
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
