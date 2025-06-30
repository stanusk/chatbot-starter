/**
 * Centralized error handling utilities
 * Provides consistent error logging, user feedback, and error categorization
 */

import { toast } from "sonner";

// Error types for categorization
export enum ErrorType {
  // API errors
  API_ERROR = "api_error",
  NETWORK_ERROR = "network_error",
  
  // Database errors
  DATABASE_ERROR = "database_error",
  SUPABASE_ERROR = "supabase_error",
  
  // Authentication errors
  AUTH_ERROR = "auth_error",
  PERMISSION_ERROR = "permission_error",
  
  // AI/Chat errors
  AI_PROVIDER_ERROR = "ai_provider_error",
  STREAMING_ERROR = "streaming_error",
  
  // UI/Component errors
  COMPONENT_ERROR = "component_error",
  VALIDATION_ERROR = "validation_error",
  
  // Generic errors
  UNKNOWN_ERROR = "unknown_error",
}

// Error severity levels
export enum ErrorSeverity {
  LOW = "low",        // Minor issues, doesn't affect core functionality
  MEDIUM = "medium",  // Affects some functionality but has workarounds
  HIGH = "high",      // Major functionality broken
  CRITICAL = "critical", // Application unusable
}

// Error context for better debugging
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

// Structured error interface
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  originalError?: Error | unknown;
  context?: ErrorContext;
  timestamp: Date;
  shouldShowToast: boolean;
  shouldLog: boolean;
}

/**
 * Creates a structured error object
 */
export function createError(
  type: ErrorType,
  severity: ErrorSeverity,
  message: string,
  userMessage: string,
  originalError?: Error | unknown,
  context?: ErrorContext
): AppError {
  return {
    type,
    severity,
    message,
    userMessage,
    originalError,
    context,
    timestamp: new Date(),
    shouldShowToast: severity !== ErrorSeverity.LOW,
    shouldLog: true,
  };
}

/**
 * Logs error to console with structured format
 */
function logError(error: AppError): void {
  if (!error.shouldLog) return;

  const logData = {
    type: error.type,
    severity: error.severity,
    message: error.message,
    timestamp: error.timestamp.toISOString(),
    context: error.context,
    originalError: error.originalError,
  };

  // Use appropriate console method based on severity
  switch (error.severity) {
    case ErrorSeverity.CRITICAL:
    case ErrorSeverity.HIGH:
      console.error(`[${error.type.toUpperCase()}]`, logData);
      break;
    case ErrorSeverity.MEDIUM:
      console.warn(`[${error.type.toUpperCase()}]`, logData);
      break;
    case ErrorSeverity.LOW:
      console.info(`[${error.type.toUpperCase()}]`, logData);
      break;
  }
}

/**
 * Shows user-friendly toast notification
 */
function showErrorToast(error: AppError): void {
  if (!error.shouldShowToast) return;

  // Choose toast type based on severity
  switch (error.severity) {
    case ErrorSeverity.LOW:
      toast.info(error.userMessage);
      break;
    case ErrorSeverity.MEDIUM:
      toast.warning(error.userMessage);
      break;
    case ErrorSeverity.HIGH:
    case ErrorSeverity.CRITICAL:
      toast.error(error.userMessage);
      break;
  }
}

/**
 * Main error handler - processes and reports errors consistently
 */
export function handleError(error: AppError): void {
  logError(error);
  showErrorToast(error);
}

/**
 * Quick error handlers for common scenarios
 */
export const ErrorHandlers = {
  // API errors
  apiError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.API_ERROR,
      ErrorSeverity.MEDIUM,
      message,
      "An error occurred while communicating with the server. Please try again.",
      originalError,
      context
    )),

  networkError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.NETWORK_ERROR,
      ErrorSeverity.HIGH,
      message,
      "Network connection failed. Please check your internet connection and try again.",
      originalError,
      context
    )),

  // Database errors
  databaseError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.DATABASE_ERROR,
      ErrorSeverity.HIGH,
      message,
      "Database operation failed. Please try again later.",
      originalError,
      context
    )),

  supabaseError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.SUPABASE_ERROR,
      ErrorSeverity.MEDIUM,
      message,
      "Data synchronization failed. Some features may not work correctly.",
      originalError,
      context
    )),

  // Authentication errors
  authError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.AUTH_ERROR,
      ErrorSeverity.HIGH,
      message,
      "Authentication failed. Please sign in again.",
      originalError,
      context
    )),

  permissionError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.PERMISSION_ERROR,
      ErrorSeverity.MEDIUM,
      message,
      "You don't have permission to perform this action.",
      originalError,
      context
    )),

  // AI/Chat errors
  aiProviderError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.AI_PROVIDER_ERROR,
      ErrorSeverity.HIGH,
      message,
      "AI service is temporarily unavailable. Please try again.",
      originalError,
      context
    )),

  streamingError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.STREAMING_ERROR,
      ErrorSeverity.MEDIUM,
      message,
      "Response streaming was interrupted. Please try again.",
      originalError,
      context
    )),

  // UI/Component errors
  componentError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.COMPONENT_ERROR,
      ErrorSeverity.LOW,
      message,
      "A component error occurred. Please refresh the page.",
      originalError,
      context
    )),

  validationError: (message: string, userMessage?: string, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.VALIDATION_ERROR,
      ErrorSeverity.LOW,
      message,
      userMessage || "Please check your input and try again.",
      undefined,
      context
    )),

  // Generic error
  unknownError: (message: string, originalError?: unknown, context?: ErrorContext) =>
    handleError(createError(
      ErrorType.UNKNOWN_ERROR,
      ErrorSeverity.MEDIUM,
      message,
      "An unexpected error occurred. Please try again.",
      originalError,
      context
    )),
};

/**
 * Utility to extract error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "Unknown error occurred";
}

/**
 * Utility to check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes("network") ||
           error.message.toLowerCase().includes("fetch") ||
           error.message.toLowerCase().includes("connection");
  }
  return false;
}

/**
 * Utility to check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error && typeof error === "object" && "message" in error) {
    const message = String(error.message).toLowerCase();
    return message.includes("auth") ||
           message.includes("unauthorized") ||
           message.includes("forbidden") ||
           message.includes("permission");
  }
  return false;
} 