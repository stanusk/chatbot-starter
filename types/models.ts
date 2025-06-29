/**
 * AI model types and configurations
 */

// Model ID constants
export const SONNET_3_7_MODEL_ID = "sonnet-3.7" as const;

// Model ID type - will be updated when we refactor models.ts
export type ModelID = "sonnet-3.7" | "deepseek-r1" | "deepseek-r1-distill-llama-70b";

// Model display names
export type ModelDisplayNames = Record<ModelID, string>; 