# Authentication Architecture Documentation

## Overview

This document describes the complete authentication implementation using Supabase with Server-Side Rendering (SSR) support and Row Level Security (RLS) for secure data access.

## Architecture Summary

The authentication system uses a **dual-client approach** with **RLS-based security**:
- **Client-side**: SSR-compatible browser client that properly sets authentication cookies
- **Server-side**: Server client that reads authentication cookies and respects RLS policies
- **Security**: Row Level Security (RLS) policies automatically filter data based on the authenticated user

## Key Components

### 1. Client-Side Authentication (`lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from '@supabase/ssr'

export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Purpose**: Handles user authentication and sets cookies for server-side reading.

### 2. Server-Side Authentication (`lib/auth/server.ts`)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createAuthenticatedSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) { /* handle cookie setting */ }
      }
    }
  );
}
```

**Purpose**: Creates authenticated Supabase clients for API routes that respect RLS policies.

### 3. Middleware (`middleware.ts`)
```typescript
export async function middleware(request: NextRequest) {
  // Creates server client and refreshes user session
  const supabase = createServerClient(/* ... */);
  await supabase.auth.getUser(); // Refreshes session if needed
  return supabaseResponse;
}
```

**Purpose**: Automatically refreshes authentication sessions on every request.

### 4. Row Level Security Policies
```sql
-- Example RLS policy for chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```

**Purpose**: Database-level security that automatically filters data based on `auth.uid()`.

## Authentication Flow Diagram

```mermaid
graph TB
    A[User visits page] --> B[Middleware runs]
    B --> C[Refresh Supabase session]
    C --> D[Set authentication cookies]
    D --> E[Page renders]
    
    E --> F[User interacts with app]
    F --> G[Frontend makes API call]
    G --> H["fetch('/api/sessions', { credentials: 'include' })"]
    H --> I[API route receives request]
    
    I --> J[createAuthenticatedSupabaseClient()]
    J --> K[Read cookies from request]
    K --> L[Create server Supabase client]
    L --> M[Client has user context from cookies]
    
    M --> N[Database query]
    N --> O[RLS policies check auth.uid()]
    O --> P[Return filtered data for user]
    P --> Q[Response sent to frontend]
    
    style B fill:#e1f5fe
    style C fill:#e1f5fe
    style J fill:#fff3e0
    style K fill:#fff3e0
    style O fill:#e8f5e8
    style P fill:#e8f5e8
```

## Data Flow Architecture

### 1. **User Sign-In Flow**
```
User enters email → supabaseBrowser.auth.signInWithOtp()
→ Magic link sent → User clicks link → Session established
→ Cookies set by browser client → Server can read session
```

### 2. **API Request Flow**
```
Frontend component → fetch('/api/sessions', { credentials: 'include' })
→ Middleware refreshes session → API route gets request
→ createAuthenticatedSupabaseClient() → Read cookies
→ Server client with user context → Database query
→ RLS filters by auth.uid() → Return user's data only
```

### 3. **Database Security Flow**
```
API calls database → Supabase checks RLS policies
→ auth.uid() compared to user_id column
→ Only matching rows returned → No manual authorization needed
```

## Key Benefits

### 1. **Security by Default**
- RLS policies prevent unauthorized data access at the database level
- Even if application code has bugs, data remains secure
- No manual authorization checks needed in API routes

### 2. **SSR Compatibility**
- Browser client properly sets cookies for server-side reading
- Middleware ensures sessions stay fresh across requests
- Server-side rendering works with authenticated state

### 3. **Simplified Code**
- API routes don't need manual user validation
- Database queries automatically filtered by RLS
- Single source of truth for authentication state

### 4. **Performance**
- Middleware caches authentication state
- RLS filtering happens at database level (efficient)
- No duplicate authentication checks

## Implementation Details

### Database Helper Functions
All database functions now accept a Supabase client parameter:
```typescript
export async function getChatSessions(supabase: SupabaseClient): Promise<ChatSession[]> {
  // RLS automatically filters sessions based on authenticated user
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("trash", false)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
```

### API Route Pattern
```typescript
export async function GET() {
  // Create authenticated client - RLS handles filtering
  const supabase = await createAuthenticatedSupabaseClient();
  const sessions = await getChatSessions(supabase);
  return NextResponse.json({ sessions });
}
```

### Frontend Components
```typescript
// Use SSR-compatible browser client
import { supabaseBrowser } from "@/lib/supabase/client";

// Make API calls with credentials
const response = await fetch('/api/sessions', {
  credentials: 'include', // Send auth cookies
  headers: { 'Content-Type': 'application/json' }
});
```

## Security Considerations

### 1. **Cookie Security**
- Authentication cookies are httpOnly and secure
- Middleware handles cookie refresh automatically
- Credentials included in all API requests

### 2. **RLS Policies**
- Policies check `auth.uid() = user_id` for ownership
- Support for anonymous sessions with `user_id IS NULL`
- Database-level enforcement prevents data leaks

### 3. **Session Management**
- Sessions automatically refreshed by middleware
- Invalid sessions result in 401 responses
- Frontend handles authentication state reactively

## Troubleshooting

### Common Issues

1. **"Auth session missing!" errors**
   - Check that `credentials: 'include'` is set on fetch calls
   - Verify middleware is running on API routes
   - Ensure cookies are being set by browser client

2. **RLS policy violations**
   - Verify user is authenticated before database operations
   - Check that RLS policies match your use case
   - Ensure `auth.uid()` returns expected user ID

3. **Multiple Supabase instances warning**
   - Use only `supabaseBrowser` for client-side operations
   - Use `createAuthenticatedSupabaseClient()` for server-side
   - Don't create multiple client instances

## Migration Notes

### From Admin Client to RLS-Based Security

**Before (Admin bypass - INSECURE):**
```typescript
// BAD: Bypasses RLS, manual auth checks required
const sessions = await supabaseAdmin
  .from("chat_sessions")
  .select("*")
  .eq("user_id", userId); // Manual filtering
```

**After (RLS-based - SECURE):**
```typescript
// GOOD: RLS handles security automatically
const supabase = await createAuthenticatedSupabaseClient();
const sessions = await supabase
  .from("chat_sessions")
  .select("*"); // RLS filters automatically
```

### Key Changes Made

1. **Replaced basic `createClient` with SSR clients**
   - Client: `createBrowserClient` (sets cookies)
   - Server: `createServerClient` (reads cookies)

2. **Added middleware for session refresh**
   - Ensures authentication state stays current
   - Handles cookie management automatically

3. **Removed manual authorization checks**
   - API routes simplified to use RLS
   - Database functions accept client parameter

4. **Fixed dependency cycles in hooks**
   - Removed functions from useEffect dependencies
   - Used refs to prevent infinite re-renders

This architecture provides a secure, scalable, and maintainable authentication system that leverages Supabase's built-in security features while supporting modern SSR requirements.