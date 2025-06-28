# Supabase Integration Setup Guide

This guide will help you set up Supabase for authentication and persistence in your AI SDK Reasoning starter.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. The AI SDK Reasoning starter project

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization and enter a project name
4. Set a database password (save this securely)
5. Choose a region close to your users
6. Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)
   - **Service role key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`) - Keep this secret!

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root:

```bash
# AI Provider API Keys (existing)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
FIREWORKS_API_KEY=your_fireworks_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Supabase Configuration (new)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

2. Replace the placeholder values with your actual Supabase credentials

## Step 4: Set Up the Database Schema (Programmatic Way)

### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):

   ```bash
   # macOS
   brew install supabase/tap/supabase

   # Other platforms: https://supabase.com/docs/guides/cli/getting-started
   ```

2. **Link to your Supabase project**:

   ```bash
   npm run db:link
   # Or: supabase link --project-ref YOUR_PROJECT_REF
   ```

   You can find your project ref in your Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

3. **Apply the database migrations**:

   ```bash
   npm run db:push
   # Or: supabase db push
   ```

4. **Check migration status**:
   ```bash
   npm run db:status
   # Or: supabase migration list
   ```

### Option B: Manual Setup (Quick Start)

If you prefer to set up quickly without CLI:

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase/migrations/20250628054434_initial_schema.sql`
3. Paste it into the SQL Editor and run it

### What Gets Created

The migration will create:

- `chat_sessions` table for storing chat sessions
- `chat_messages` table for storing individual messages
- Proper indexes for performance
- Row Level Security (RLS) policies for data protection
- Realtime subscriptions for live updates

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to Authentication → Settings
2. Under "Site URL", add your development URL: `http://localhost:3000`
3. Under "Redirect URLs", add: `http://localhost:3000`
4. For production, add your production domain
5. Enable "Email" provider under Authentication → Providers
6. Configure email templates if desired under Authentication → Email Templates

## Step 6: Install Dependencies and Run

The Supabase client is already installed. Just run:

```bash
npm run dev
```

## Features Included

### ✅ Authentication

- Magic link authentication (passwordless)
- User session management
- Automatic auth state handling

### ✅ Chat Persistence

- All conversations saved to Supabase
- Messages include reasoning data and scores
- Session-based organization

### ✅ Real-time Features

- Live message updates (ready for multi-user features)
- Automatic session tracking

### ✅ Security

- Row Level Security (RLS) enabled
- Users can only access their own data
- Service role for server-side operations

### ✅ UI Components

- Sidebar with authentication
- Chat history browser
- Mobile-responsive design
- Dark mode support

## Database Schema

### chat_sessions

- `id`: UUID primary key
- `user_id`: Foreign key to auth.users
- `title`: Chat session title
- `created_at`, `updated_at`: Timestamps
- `metadata`: JSON for additional data

### chat_messages

- `id`: UUID primary key
- `session_id`: Foreign key to chat_sessions
- `role`: 'user' | 'assistant' | 'system'
- `content`: Message content
- `reasoning`: AI reasoning data (optional)
- `score`: Message quality score (optional)
- `created_at`: Timestamp
- `metadata`: JSON for additional data (model, usage, etc.)

## Managing Database Changes

### Creating New Migrations

When you need to make database changes (add tables, modify columns, etc.):

1. **Create a new migration**:

   ```bash
   npm run db:migrate your_migration_name
   # Or: supabase migration new your_migration_name
   ```

2. **Edit the migration file** in `supabase/migrations/` with your SQL changes

3. **Apply the migration**:
   ```bash
   npm run db:push
   ```

### Example: Adding a new column

```bash
# Create migration
npm run db:migrate add_user_preferences

# Edit supabase/migrations/TIMESTAMP_add_user_preferences.sql
# Add your SQL:
# ALTER TABLE chat_sessions ADD COLUMN user_preferences JSONB DEFAULT '{}'::jsonb;

# Apply migration
npm run db:push
```

### Local Development

You can also run a local Supabase instance for development:

```bash
# Start local Supabase (includes PostgreSQL, Auth, etc.)
npm run supabase:start

# Stop local instance
npm run supabase:stop

# Reset local database
npm run db:reset
```

## Next Steps

### Optional Enhancements

1. **User Profiles**: Add user profile management
2. **Shared Chats**: Allow users to share conversations
3. **Search**: Add full-text search across conversations
4. **Export**: Allow users to export their chat history
5. **Analytics**: Track usage patterns and model performance
6. **Vector Search**: Add pgvector for semantic search

### Production Deployment

1. Set up environment variables in your hosting platform
2. Update Supabase redirect URLs for your production domain
3. Consider setting up database backups
4. Monitor usage and set up appropriate database limits

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure `.env.local` is in your project root
2. **Database connection errors**: Verify your Supabase URL and keys
3. **Authentication not working**: Check your redirect URLs in Supabase settings
4. **RLS errors**: Ensure you're signed in when testing authenticated features

### Support

- Check the [Supabase documentation](https://supabase.com/docs)
- Visit the [AI SDK documentation](https://sdk.vercel.ai/docs)
- Join the [Supabase Discord](https://discord.supabase.com) for community support

## Security Notes

- Never commit your `.env.local` file to version control
- The service role key has admin privileges - keep it secure
- RLS policies protect user data - test them thoroughly
- Consider enabling MFA for your Supabase account
