/**
 * Chat feature configuration
 * 
 * This file contains feature flags and configuration options for the chat interface.
 * These settings control which features are enabled or disabled.
 */

export const chatConfig = {
  /**
   * Enable message editing feature
   * When true, users can edit their most recent message
   * Default: false
   */
  enableMessageEditing: true,
} as const;

export type ChatConfig = typeof chatConfig;