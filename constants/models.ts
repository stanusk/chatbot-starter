import { SONNET_3_7_MODEL_ID, type ModelID } from "@/types/models";

// Model display names configuration
export const models: Record<ModelID, string> = {
  [SONNET_3_7_MODEL_ID]: "Claude Sonnet 3.7",
  "deepseek-r1": "DeepSeek-R1",
  "deepseek-r1-distill-llama-70b": "DeepSeek-R1 Llama 70B",
};

// Default model settings
export const DEFAULT_MODEL_SETTINGS = {
  THINKING_BUDGET_TOKENS: 5000,
  REASONING_TAG_NAME: "think",
} as const;

// Re-export types for convenience
export type { ModelID, ModelDisplayNames } from "@/types/models";
export { SONNET_3_7_MODEL_ID } from "@/types/models";
