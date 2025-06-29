/**
 * UI component types
 */

import React from "react";
// Using legacy modelID type for backward compatibility with existing UI components
// TODO: Migrate to ModelID when lib/models.ts is fully updated

// Button component types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// UI Input component types (different from components/input.tsx)
export type UIInputProps = React.InputHTMLAttributes<HTMLInputElement>;

// Textarea component types
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// Chat input component types
export interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  selectedModelId: string; // Using string for backward compatibility
  setSelectedModelId: (modelId: string) => void;
  isReasoningEnabled: boolean;
  setIsReasoningEnabled: (enabled: boolean) => void;
  isGeneratingResponse: boolean;
  onSubmit: () => void;
  onStop: () => void;
}

// Model selector component types
export interface ModelSelectorProps {
  selectedModelId: string; // Using string for backward compatibility
  onModelChange: (modelId: string) => void;
}

// Reasoning toggle component types
export interface ReasoningToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

// Generic component types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Icon component types
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
} 