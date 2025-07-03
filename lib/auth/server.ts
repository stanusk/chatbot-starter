/**
 * Server-side authentication utilities for API routes
 * Creates authenticated Supabase clients for RLS-based security
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Create an authenticated Supabase client for server-side use in API routes
 * This client will respect RLS policies based on the authenticated user
 */
export async function createAuthenticatedSupabaseClient(): Promise<SupabaseClient> {
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