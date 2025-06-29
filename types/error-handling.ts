/**
 * Error handling types
 */

// Re-export error handling types for centralized access
export type {
  ErrorType,
  ErrorSeverity,
  ErrorContext,
  AppError,
} from "@/lib/error-handling";

// Additional error-related types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ 
    error?: Error; 
    errorInfo?: React.ErrorInfo;
    resetError: () => void; 
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
} 