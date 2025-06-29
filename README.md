<a href="https://github.com/YOUR_USERNAME/chatbot-starter">
  <img alt="Next.js 15 and App Router-ready AI chatbot with authentication and persistence." src="app/opengraph-image.png">
  <h1 align="center">AI Chatbot Starter</h1>
</a>

<p align="center">
  A Full-Stack AI Chatbot Template with Authentication & Persistence Built With Next.js, AI SDK, and Supabase.
</p>

<p align="center">
  <strong>Based on Vercel's AI SDK Reasoning template with enhanced features</strong>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#setup"><strong>Setup</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a>
</p>
<br/>

## Features

### 🤖 AI & Chat

- [AI SDK](https://sdk.vercel.ai/docs) - Unified API for generating text, structured objects, and tool calls with LLMs
- Support for multiple AI providers: Anthropic (default), OpenAI, xAI, Deepseek, Fireworks, and Groq
- Advanced reasoning capabilities with score tracking
- Real-time chat interface with markdown support

### 🔐 Authentication & Persistence

- **Supabase Integration** - Full authentication and database persistence
- Magic link authentication (passwordless login)
- Secure user session management with proper error handling
- Chat history saved and organized by sessions
- Row Level Security (RLS) for data protection
- Graceful fallback when Supabase is unavailable

### 🎨 Modern Stack

- [Next.js 15](https://nextjs.org) App Router with React Server Components
- [shadcn/ui](https://ui.shadcn.com) components with [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com) primitives for accessibility
- Responsive design with dark mode support
- Mobile-optimized interface

### 🚀 Developer Experience

- TypeScript for type safety
- Supabase CLI integration for database management
- Database migrations and schema management
- Hot reload with Turbopack
- ESLint configuration
- Comprehensive error handling and troubleshooting
- VS Code/Cursor optimized settings for Edge Functions

## Quick Start

1. **Clone and install dependencies:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/chatbot-starter.git
   cd chatbot-starter
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Add your API keys (see Setup section below)
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Setup

### AI Provider API Keys

You'll need at least one AI provider API key. Add to your `.env.local`:

```bash
# Choose one or more providers
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
FIREWORKS_API_KEY=your_fireworks_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Supabase Setup

For authentication and persistence features:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Add Supabase credentials** to `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. **Set up the database:**

   ```bash
   # Initialize Supabase (creates config and VS Code settings)
   echo "y" | supabase init --force

   # Link to your Supabase project
   pnpm run db:link

   # Apply database migrations
   pnpm run db:push
   ```

📖 **Detailed setup instructions:** See [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

### Important Setup Notes

⚠️ **Environment Variables:** Ensure all API keys are on single lines in `.env.local` - line breaks will cause initialization failures.

⚠️ **Prerequisites:** Node.js 20+ and npm 10+ are required for optimal performance.

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fchatbot-starter&env=ANTHROPIC_API_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&envDescription=AI%20provider%20API%20keys%20and%20Supabase%20credentials)

### Manual Deployment

1. **Build the project:**

   ```bash
   pnpm build
   ```

2. **Set environment variables** in your hosting provider

3. **Deploy** using your preferred method (Vercel, Netlify, etc.)

## Database Management

- **Create migration:** `pnpm run db:migrate migration_name`
- **Apply migrations:** `pnpm run db:push`
- **Reset database:** `pnpm run db:reset`
- **Check status:** `pnpm run db:status`

## Troubleshooting

### Common Issues

- **"supabaseKey is required" error**: Check that environment variables are on single lines in `.env.local`
- **"Failed to load chat sessions"**: Run `pnpm run db:push` to apply database migrations
- **Multiple authentication toasts**: Already fixed in the latest version
- **TypeScript null errors**: Proper null checking is implemented for Supabase client

### Quick Fixes

1. **Environment issues**: Restart dev server after updating `.env.local`
2. **Database issues**: Run `pnpm run db:push` to apply migrations
3. **Authentication issues**: Check Supabase dashboard settings for correct redirect URLs

📖 **Comprehensive troubleshooting guide:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Contributing

This project is based on [Vercel's AI SDK Reasoning template](https://github.com/vercel-labs/ai-sdk-preview-reasoning).

Feel free to contribute by:

- Adding new AI providers
- Enhancing the UI/UX
- Adding new features
- Improving documentation
- Reporting bugs or suggesting improvements

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built on top of [Vercel's AI SDK Reasoning template](https://github.com/vercel-labs/ai-sdk-preview-reasoning)
- Powered by [Vercel AI SDK](https://sdk.vercel.ai/)
- Database and authentication by [Supabase](https://supabase.com)
- UI components by [shadcn/ui](https://ui.shadcn.com)
