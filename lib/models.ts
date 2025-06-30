import { anthropic } from "@ai-sdk/anthropic";
import { fireworks } from "@ai-sdk/fireworks";
import { groq } from "@ai-sdk/groq";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  defaultSettingsMiddleware,
} from "ai";
import { SONNET_3_7_MODEL_ID } from "@/types/models";
import { DEFAULT_MODEL_SETTINGS } from "@/constants";

// custom provider with different model settings:
export const myProvider = customProvider({
  languageModels: {
    [SONNET_3_7_MODEL_ID]: wrapLanguageModel({
      middleware: defaultSettingsMiddleware({
        settings: {
          providerMetadata: {
            anthropic: {
              thinking: { type: "enabled", budgetTokens: DEFAULT_MODEL_SETTINGS.THINKING_BUDGET_TOKENS },
            },
          },
        },
      }),
      model: anthropic("claude-3-7-sonnet-20250219"),
    }),
    "deepseek-r1": wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: DEFAULT_MODEL_SETTINGS.REASONING_TAG_NAME,
      }),
      model: fireworks("accounts/fireworks/models/deepseek-r1"),
    }),
    "deepseek-r1-distill-llama-70b": wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: DEFAULT_MODEL_SETTINGS.REASONING_TAG_NAME,
      }),
      model: groq("deepseek-r1-distill-llama-70b"),
    }),
  },
});

// Re-export types and constants from centralized locations for backward compatibility
export type { ModelID, ModelDisplayNames, modelID } from "@/constants";
export { SONNET_3_7_MODEL_ID, models } from "@/constants";
