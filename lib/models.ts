import { anthropic } from "@ai-sdk/anthropic";
import { fireworks } from "@ai-sdk/fireworks";
import { groq } from "@ai-sdk/groq";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  defaultSettingsMiddleware,
} from "ai";
import { SONNET_3_7_MODEL_ID, type ModelID } from "@/types/models";

// custom provider with different model settings:
export const myProvider = customProvider({
  languageModels: {
    [SONNET_3_7_MODEL_ID]: wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            anthropic: {
              thinking: { type: "enabled", budgetTokens: 5000 },
            },
          },
        },
      }),
      model: anthropic("claude-3-7-sonnet-20250219"),
    }),
    "deepseek-r1": wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: "think",
      }),
      model: fireworks("accounts/fireworks/models/deepseek-r1"),
    }),
    "deepseek-r1-distill-llama-70b": wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: "think",
      }),
      model: groq("deepseek-r1-distill-llama-70b"),
    }),
  },
});

// Re-export types from centralized types for backward compatibility
export type { ModelID, ModelDisplayNames } from "@/types/models";
export { SONNET_3_7_MODEL_ID } from "@/types/models";

// Legacy export for backward compatibility
export type modelID = ModelID;

export const models: Record<ModelID, string> = {
  [SONNET_3_7_MODEL_ID]: "Claude Sonnet 3.7",
  "deepseek-r1": "DeepSeek-R1",
  "deepseek-r1-distill-llama-70b": "DeepSeek-R1 Llama 70B",
};
