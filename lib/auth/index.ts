/**
 * Server-side authentication utilities for API routes
 * Provides functions to validate user authentication and get user info from requests
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ApiErrors } from "@/lib/api/error-responses";
import { ErrorHandlers } from "@/lib/error-handling";
import type { User } from "@supabase/supabase-js";

/**
 * Create a Supabase client for server-side authentication in API routes
 * This client can read cookies and validate user sessions
 */
async function createAuthClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: { [key: string]: unknown } }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a server component
            // This can be ignored if you have middleware refreshing user sessions
          }
        },
      },
    }
  );
}

/**
 * Get the authenticated user from the request
 * Returns the user if authenticated, null if not authenticated
 * Uses supabase.auth.getUser() which validates the token with Supabase Auth server
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const supabase = await createAuthClient();
    
    // Use getUser() which validates the token with Supabase Auth server
    // This is more secure than getSession() which only reads from cookies
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      ErrorHandlers.authError("Authentication error during getUser", error, {
        component: "getAuthenticatedUser",
        action: "getUser",
      });
      return null;
    }

    return user;
  } catch (error) {
    ErrorHandlers.authError("Error getting authenticated user", error, {
      component: "getAuthenticatedUser",
      action: "createAuthClient",
    });
    return null;
  }
}

/**
 * Middleware function to require authentication for API routes
 * Returns the authenticated user or throws an unauthorized response
 */
export async function requireAuth(): Promise<User> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw ApiErrors.unauthorized("Authentication required to access this resource");
  }
  
  return user;
}

/**
 * Check if a user is authenticated without throwing errors
 * Useful for optional authentication scenarios
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthenticatedUser();
  return user !== null;
} 