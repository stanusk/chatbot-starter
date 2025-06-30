import type { MobileHeaderProps } from "@/types/components";

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
        aria-label="Open menu"
      >
        ☰
      </button>
      <h1 className="text-lg font-semibold">AI SDK Reasoning</h1>
      <div className="w-10" /> {/* Spacer for centering */}
    </div>
  );
}
