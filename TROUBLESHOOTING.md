# Troubleshooting Guide: AI SDK Reasoning Starter with Supabase

This guide documents common issues encountered when setting up the AI SDK Reasoning starter with Supabase authentication and chat persistence, along with their solutions.

## 🚨 Problems Encountered & Solutions

### 1. Chat History Loading Error

**Problem:**

- Console error: `Failed to load chat sessions: {}`
- Multiple "Successfully signed in" toast notifications
- Chat history sidebar shows loading error

**Root Cause:**

- Database tables (`chat_sessions` and `chat_messages`) don't exist in Supabase
- Poor error handling in React components
- Authentication state changes firing multiple times

**Solution:**

1. **Set up database schema using migrations** (see Database Setup section below)
2. **Improved error handling** in `components/chat-history.tsx`:
   ```typescript
   } catch (error) {
     console.error("Failed to load chat sessions:", error);
     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
     toast.error(`Failed to load chat history: ${errorMessage}`);
   }
   ```
3. **Fixed multiple auth toasts** in `components/auth.tsx`:
   ```typescript
   // Only show toast for explicit sign in/out events, not initial session loading
   if (event === "SIGNED_IN" && session?.user) {
     toast.success("Successfully signed in!");
   }
   ```

### 2. Manual Schema Management Issues

**Problem:**

- Having to manually copy/paste SQL into Supabase dashboard
- No version control for database changes
- Risk of inconsistencies between environments

**Solution:**

- **Implemented Supabase CLI with migrations**
- **Added npm scripts** for database management
- **Created proper migration files** in `supabase/migrations/`

## 🛠 Complete Setup Process

### Prerequisites

- Node.js 20+ and npm 10+
- Supabase account and project
- Homebrew (for macOS CLI installation)

### 1. Environment Setup

Create `.env.local`:

```bash
# AI Provider API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
FIREWORKS_API_KEY=your_fireworks_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Supabase CLI Installation

```bash
# macOS
brew install supabase/tap/supabase

# Other platforms
# See: https://supabase.com/docs/guides/cli/getting-started
```

### 3. Initialize Supabase Project

```bash
# Initialize with VS Code/Cursor settings for Edge Functions
echo "y" | supabase init --force
```

This creates:

- `supabase/` directory with configuration
- `.vscode/settings.json` with Deno support for Edge Functions
- Migration system setup

### 4. Database Setup

```bash
# Link to your Supabase project
npm run db:link
# Enter your project reference when prompted

# Apply the initial schema migration
npm run db:push

# Verify migration status
npm run db:status
```

### 5. Authentication Configuration

In Supabase Dashboard → Authentication → Settings:

- **Site URL**: `http://localhost:3000` (development)
- **Redirect URLs**: `http://localhost:3000`
- **Email Provider**: Enabled
- For production: Add your production domain

## 📁 Project Structure After Setup

```
ai-sdk-reasoning-starter/
├── .env.local                          # Environment variables
├── .vscode/
│   ├── settings.json                   # Deno settings for Edge Functions
│   └── extensions.json                 # Recommended extensions
├── supabase/
│   ├── config.toml                     # Supabase configuration
│   ├── migrations/
│   │   └── 20250628054434_initial_schema.sql  # Database schema
│   └── .gitignore
├── components/
│   ├── auth.tsx                        # Authentication component
│   ├── chat-history.tsx               # Chat history with error handling
│   └── ...
├── lib/
│   └── supabase.ts                     # Supabase client & helper functions
├── package.json                        # Added database management scripts
├── SUPABASE_SETUP.md                   # Setup instructions
└── TROUBLESHOOTING.md                  # This file
```

## 🔧 Database Management Commands

```bash
# Link to Supabase project
npm run db:link

# Apply migrations to remote database
npm run db:push

# Check migration status
npm run db:status

# Create new migration
npm run db:migrate migration_name

# Start local Supabase instance
npm run supabase:start

# Stop local instance
npm run supabase:stop

# Reset local database
npm run db:reset
```

## 🐛 Common Issues & Quick Fixes

### Issue: "Supabase client not initialized"

**Cause:** Missing environment variables
**Fix:**

1. Check `.env.local` exists and has correct values
2. Restart development server: `npm run dev`

### Issue: "Failed to load chat sessions"

**Cause:** Database tables don't exist
**Fix:** Run `npm run db:push` to apply migrations

### Issue: Multiple authentication toasts

**Cause:** Auth state listener firing multiple times
**Fix:** Already fixed in `components/auth.tsx` (see code above)

### Issue: RLS (Row Level Security) errors

**Cause:** User not authenticated or policies incorrect
**Fix:**

1. Ensure user is signed in
2. Check RLS policies in migration file
3. Verify auth.uid() is working in Supabase

### Issue: Migration conflicts

**Cause:** Manual changes made to database outside of migrations
**Fix:**

1. Reset database: `npm run db:reset`
2. Reapply migrations: `npm run db:push`

## 🔄 Starting Fresh (Complete Reset)

If you need to restart the project from scratch:

### 1. Clean Local Setup

```bash
# Remove Supabase configuration
rm -rf supabase/
rm -rf .vscode/

# Remove environment file
rm .env.local

# Clean node modules (optional)
rm -rf node_modules/
npm install
```

### 2. Reset Supabase Project

In Supabase Dashboard:

- Go to Settings → General
- Scroll down to "Danger Zone"
- Reset database or create new project

### 3. Re-run Setup

Follow the complete setup process above from step 1.

## 📋 Migration Best Practices

### Creating Schema Changes

1. **Always use migrations** for schema changes:

   ```bash
   npm run db:migrate add_user_preferences
   ```

2. **Write reversible migrations** when possible:

   ```sql
   -- Migration up
   ALTER TABLE chat_sessions ADD COLUMN user_preferences JSONB DEFAULT '{}'::jsonb;

   -- To reverse (create separate migration):
   -- ALTER TABLE chat_sessions DROP COLUMN user_preferences;
   ```

3. **Test migrations locally first**:
   ```bash
   npm run supabase:start  # Start local instance
   npm run db:push         # Apply to local
   # Test your changes
   npm run supabase:stop   # Stop when done
   ```

### Version Control

- **Always commit migrations** to git
- **Never edit applied migrations** - create new ones instead
- **Document breaking changes** in migration comments

## 🚀 Production Deployment Checklist

- [ ] Environment variables set in hosting platform
- [ ] Supabase redirect URLs updated for production domain
- [ ] Database migrations applied to production
- [ ] RLS policies tested with real users
- [ ] Backup strategy configured
- [ ] Monitoring and logging set up

## 📚 Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [AI SDK Documentation](https://sdk.vercel.ai/docs)

## 🆘 Getting Help

If you encounter issues not covered here:

1. **Check Supabase logs** in dashboard → Logs
2. **Enable debug mode**: Add `--debug` to Supabase CLI commands
3. **Check browser console** for client-side errors
4. **Verify environment variables** are loaded correctly
5. **Test with a fresh Supabase project** to isolate issues

---

**Last Updated:** January 2025  
**Supabase CLI Version:** 2.26.9  
**AI SDK Version:** 4.1.66
