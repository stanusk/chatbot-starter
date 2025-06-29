import { anthropic } from "@ai-sdk/anthropic";
import { fireworks } from "@ai-sdk/fireworks";
import { groq } from "@ai-sdk/groq";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  defaultSettingsMiddleware,
} from "ai";

// Model ID constants
export const SONNET_3_7_MODEL_ID = "sonnet-3.7" as const;

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

export type modelID = Parameters<(typeof myProvider)["languageModel"]>["0"];

export const models: Record<modelID, string> = {
  [SONNET_3_7_MODEL_ID]: "Claude Sonnet 3.7",
  "deepseek-r1": "DeepSeek-R1",
  "deepseek-r1-distill-llama-70b": "DeepSeek-R1 Llama 70B",
};
