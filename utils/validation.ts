/**
 * Validation utilities for API routes and forms
 * Provides reusable validation functions for common data types
 */

// UUID validation regex (RFC 4122 compliant)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID format
 * @param value - The string to validate
 * @returns True if the string is a valid UUID, false otherwise
 */
export function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Validates UUID and throws an error if invalid
 * @param value - The UUID string to validate
 * @param fieldName - Name of the field for error messages (default: "UUID")
 * @throws Error if the UUID is invalid
 */
export function validateUUID(value: string, fieldName: string = "UUID"): void {
  if (!isValidUUID(value)) {
    throw new Error(`Invalid ${fieldName} format`);
  }
}

/**
 * Validates UUID format for API routes
 * @param value - The UUID string to validate
 * @param fieldName - Name of the field for error messages
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateUUIDForAPI(value: string, fieldName: string = "ID"): {
  isValid: boolean;
  error?: string;
} {
  if (!isValidUUID(value)) {
    return {
      isValid: false,
      error: `Invalid ${fieldName} format`
    };
  }
  
  return { isValid: true };
} 