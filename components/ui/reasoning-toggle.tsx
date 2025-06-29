"use client";

import { CheckedSquare, UncheckedSquare } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReasoningToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function ReasoningToggle({
  isEnabled,
  onToggle,
  disabled = false,
}: ReasoningToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={onToggle}
      className={cn("h-8 px-2 gap-2", isEnabled && "bg-accent")}
    >
      {isEnabled ? <CheckedSquare /> : <UncheckedSquare />}
      <span className="text-sm">Reasoning</span>
    </Button>
  );
}
