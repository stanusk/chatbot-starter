/**
 * Client-side Supabase client for browser use
 * This client properly handles cookies for SSR compatibility
 */

import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Singleton instance for client-side use
export const supabaseBrowser = createSupabaseClient()