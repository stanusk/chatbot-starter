/**
 * Standardized API error response utilities
 * Provides consistent error responses across all API routes
 */

import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/types/api";
import { getErrorMessage } from "@/lib/error-handling";

// HTTP status codes for different error types
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * Creates a standardized error response
 */
function createErrorResponse(
  error: string,
  message: string,
  code: string,
  status: number
): NextResponse<ApiErrorResponse> {
  const errorResponse: ApiErrorResponse = {
    error,
    message,
    code,
  };

  return NextResponse.json(errorResponse, { status });
}

/**
 * Logs API errors with consistent format
 */
function logApiError(
  endpoint: string,
  error: unknown,
  context?: Record<string, unknown>
): void {
  const logData = {
    endpoint,
    error: getErrorMessage(error),
    context,
    timestamp: new Date().toISOString(),
  };

  console.error("[API_ERROR]", logData);
}

/**
 * Standard API error responses
 */
export const ApiErrors = {
  // Client errors (4xx)
  badRequest: (message = "Invalid request parameters", details?: unknown) => {
    if (details) {
      logApiError("unknown", details, { type: "bad_request" });
    }
    return createErrorResponse(
      "Bad Request",
      message,
      "BAD_REQUEST",
      HTTP_STATUS.BAD_REQUEST
    );
  },

  unauthorized: (message = "Authentication required") => {
    return createErrorResponse(
      "Unauthorized",
      message,
      "UNAUTHORIZED",
      HTTP_STATUS.UNAUTHORIZED
    );
  },

  forbidden: (message = "Access denied") => {
    return createErrorResponse(
      "Forbidden",
      message,
      "FORBIDDEN",
      HTTP_STATUS.FORBIDDEN
    );
  },

  notFound: (resource = "Resource", message?: string) => {
    return createErrorResponse(
      "Not Found",
      message || `${resource} not found`,
      "NOT_FOUND",
      HTTP_STATUS.NOT_FOUND
    );
  },

  methodNotAllowed: (method: string) => {
    return createErrorResponse(
      "Method Not Allowed",
      `HTTP method ${method} is not allowed for this endpoint`,
      "METHOD_NOT_ALLOWED",
      HTTP_STATUS.METHOD_NOT_ALLOWED
    );
  },

  conflict: (message = "Resource conflict") => {
    return createErrorResponse(
      "Conflict",
      message,
      "CONFLICT",
      HTTP_STATUS.CONFLICT
    );
  },

  validationError: (message = "Validation failed", details?: unknown) => {
    if (details) {
      logApiError("unknown", details, { type: "validation_error" });
    }
    return createErrorResponse(
      "Validation Error",
      message,
      "VALIDATION_ERROR",
      HTTP_STATUS.UNPROCESSABLE_ENTITY
    );
  },

  rateLimited: (message = "Too many requests") => {
    return createErrorResponse(
      "Rate Limited",
      message,
      "RATE_LIMITED",
      HTTP_STATUS.TOO_MANY_REQUESTS
    );
  },

  // Server errors (5xx)
  internalError: (endpoint: string, error: unknown, message = "Internal server error") => {
    logApiError(endpoint, error, { type: "internal_error" });
    return createErrorResponse(
      "Internal Server Error",
      message,
      "INTERNAL_ERROR",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  },

  serviceUnavailable: (service: string, error?: unknown) => {
    if (error) {
      logApiError("service", error, { service, type: "service_unavailable" });
    }
    return createErrorResponse(
      "Service Unavailable",
      `${service} is temporarily unavailable`,
      "SERVICE_UNAVAILABLE",
      HTTP_STATUS.SERVICE_UNAVAILABLE
    );
  },

  gatewayTimeout: (service: string) => {
    return createErrorResponse(
      "Gateway Timeout",
      `${service} request timed out`,
      "GATEWAY_TIMEOUT",
      HTTP_STATUS.GATEWAY_TIMEOUT
    );
  },

  // Specific error types
  databaseError: (endpoint: string, error: unknown) => {
    logApiError(endpoint, error, { type: "database_error" });
    return createErrorResponse(
      "Database Error",
      "Database operation failed",
      "DATABASE_ERROR",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  },

  aiProviderError: (endpoint: string, error: unknown) => {
    logApiError(endpoint, error, { type: "ai_provider_error" });
    return createErrorResponse(
      "AI Provider Error",
      "AI service is temporarily unavailable",
      "AI_PROVIDER_ERROR",
      HTTP_STATUS.BAD_GATEWAY
    );
  },

  streamingError: (endpoint: string, error: unknown) => {
    logApiError(endpoint, error, { type: "streaming_error" });
    return createErrorResponse(
      "Streaming Error",
      "Response streaming failed",
      "STREAMING_ERROR",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  },
};

/**
 * Error handler wrapper for API routes
 * Automatically catches and standardizes errors
 */
export function withErrorHandler<T extends unknown[]>(
  endpoint: string,
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Determine error type and return appropriate response
      if (error instanceof Error) {
        if (error.message.includes("unauthorized") || error.message.includes("auth")) {
          return ApiErrors.unauthorized();
        }
        if (error.message.includes("not found")) {
          return ApiErrors.notFound();
        }
        if (error.message.includes("validation") || error.message.includes("invalid")) {
          return ApiErrors.validationError(error.message);
        }
        if (error.message.includes("database") || error.message.includes("supabase")) {
          return ApiErrors.databaseError(endpoint, error);
        }
        if (error.message.includes("ai") || error.message.includes("provider")) {
          return ApiErrors.aiProviderError(endpoint, error);
        }
      }

      // Default to internal server error
      return ApiErrors.internalError(endpoint, error);
    }
  };
}

/**
 * Utility to check if a response is an error response
 */
export function isErrorResponse(response: NextResponse): boolean {
  return response.status >= 400;
}

/**
 * Utility to extract error details from API response
 */
export async function extractErrorDetails(response: Response): Promise<ApiErrorResponse | null> {
  if (!isErrorResponse(response as NextResponse)) {
    return null;
  }

  try {
    const errorData = await response.json();
    if (errorData && typeof errorData === "object" && "error" in errorData) {
      return errorData as ApiErrorResponse;
    }
  } catch {
    // Response is not JSON or malformed
  }

  return {
    error: "Unknown Error",
    message: "An unknown error occurred",
    code: "UNKNOWN_ERROR",
  };
} 