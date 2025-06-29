# About Project

## 🤖 Project Overview

**AI Chatbot Starter** - A full-stack chat application built on Vercel's AI SDK Reasoning template with added authentication, persistence, and multi-provider AI support.

**Key Purpose**: Production-ready foundation for AI chatbot applications with secure user sessions and chat history persistence.

## 🛠️ Technology Stack

### AI & Chat Specific

- **Vercel AI SDK** - Multi-provider AI integration with streaming
- **Anthropic Claude Sonnet 3.7** - Primary AI model with reasoning capabilities
- **Additional AI Providers** - OpenAI, Groq, Fireworks, DeepSeek support
- **Reasoning Mode** - Advanced AI thinking with score tracking
- **Smooth Streaming** - Word-based chunking for natural responses

### Authentication & Data

- **Supabase** - Magic link authentication + PostgreSQL database
- **Row Level Security** - User data isolation
- **Real-time Subscriptions** - Live chat updates

### UI Framework

- **Next.js 15 App Router** with React Server Components
- **shadcn/ui** - Component library with Radix UI primitives

## 📁 Project-Specific Organization

```
├── app/api/chat/route.ts      # AI streaming endpoint with session management
├── components/
│   ├── auth.tsx               # Magic link authentication
│   ├── chat.tsx               # Main chat with model selection
│   ├── chat-history.tsx       # Session management sidebar
│   └── ui/                    # shadcn/ui components
├── hooks/
│   ├── useAuth.ts             # Supabase auth integration
│   ├── useChat.ts             # AI SDK chat state
│   └── useChatHistory.ts      # Session history management
├── lib/
│   ├── supabase.ts            # Chat session & message persistence
│   ├── models.ts              # AI provider configuration
│   └── date-utils.ts          # Chat timestamp formatting
└── supabase/migrations/       # Database schema for chat data
```

## 🗄️ Database Schema

### Chat-Specific Tables

- **chat_sessions**: User sessions with auto-generated titles
- **chat_messages**: Messages with reasoning text and AI scores
- **Metadata columns**: JSONB for model info, usage stats, reasoning flags

### Key Features

- Automatic session title generation from first message
- AI reasoning storage separate from main content
- Score tracking for response quality
- Real-time message subscriptions

## 🎯 Unique Features

### AI Integration

- **Model switching** during conversations
- **Reasoning toggle** for Claude Sonnet 3.7
- **Score-based response tracking**
- **Automatic session title generation**
- **Graceful fallback** when AI providers fail

### Chat Experience

- **Session persistence** across browser sessions
- **Magic link authentication** (passwordless)
- **Real-time message streaming**
- **Chat history sidebar** with session management
- **Mobile-responsive** chat interface

### Data Handling

- **Automatic message saving** during streaming
- **Session creation** on first message
- **User isolation** via Supabase RLS
- **Reasoning text separation** from main content

## 🔍 Project-Specific Patterns

### AI Provider Setup

- Custom provider wrapper with reasoning middleware
- Model-specific settings (thinking budget, tag extraction)
- Fallback handling for unavailable providers

### Session Management

- Auto-create sessions on first message
- Title generation from user's first input
- Silent history refresh to avoid UI flicker

### Authentication Flow

- Magic link with email input
- Graceful degradation when offline
- Session state persistence across refreshes

## 📚 Project Documentation

- `SUPABASE_SETUP.md` - Database setup and RLS configuration
- `TROUBLESHOOTING.md` - Common AI/auth issues
- `design_system_style_guide.md` - Chat-specific UI patterns
- `tasks.md` - Development roadmap

This starter provides the complete infrastructure for AI chat applications with user accounts, persistent conversations, and multi-provider AI support.
