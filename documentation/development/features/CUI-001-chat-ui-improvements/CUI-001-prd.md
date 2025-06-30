# Chat UI Improvements - PRD

## Overview

This feature enhances the chat interface with two key improvements: redesigning the "New Chat" button to look like an actual button (not a chat history item) with immediate placeholder creation, and implementing automatic timestamp updates for chat history items. Additionally, it introduces AI-powered chat title generation using the cheapest Anthropic model to replace the current truncation-based naming.

## Scope

### Included

- Redesigned "New Chat" button with distinct button styling
- Immediate temporary placeholder creation for new chats
- AI-powered chat title generation after assistant's first response
- Automatic timestamp updates for all chat sessions
- Real-time visual feedback for title changes
- Cleanup logic for unused placeholder chats
- Fallback to current truncation method if AI title generation fails

### Excluded

- Changes to existing chat history item styling (except for the new chat button)
- Modifications to the chat conversation interface
- Changes to message persistence or chat functionality
- Alternative AI providers for title generation (only Anthropic)

## User Stories / Use Cases

- As a user, I want to click a clearly identifiable "New Chat" button so that I can easily distinguish it from existing chat history items.
- As a user, I want to immediately see a new chat entry appear and be selected when I click "New Chat" so that the interface feels responsive.
- As a user, I want my chat to automatically get a meaningful title after the first Q&A exchange so that I can easily identify conversations in my history.
- As a user, I want to see chat timestamps update regularly so that I have accurate information about when interactions occurred.
- As a user, I want to see a visual indication when a chat title changes from "New Chat" to the AI-generated title so that I understand the system is working.
- As a user, I want multiple clicks on "New Chat" to select the existing placeholder rather than creating duplicates so that the interface remains clean.

## Requirements

### Functional Requirements

1. **New Chat Button Styling**: The "New Chat" button must be visually distinct from chat history items with clear button appearance.

2. **Immediate Placeholder Creation**: Clicking "New Chat" must immediately create a temporary "New Chat" placeholder in the history list and select it.

3. **Single Placeholder Logic**: Multiple clicks on "New Chat" must select the existing placeholder rather than creating duplicates.

4. **AI Title Generation**: After the assistant's first response, the chat title must be automatically generated using the cheapest reasonable Anthropic model.

5. **Title Generation Fallback**: If AI title generation fails, the system must fall back to the current truncation-based method.

6. **Real-time Title Animation**: When the title changes from "New Chat" to the AI-generated title, there must be a visual indication that appears like real-time rewriting.

7. **Placeholder Cleanup**: Unused placeholder entries (where no message was sent) must be automatically cleaned up after clicking away.

8. **Timestamp Updates**: All chat session timestamps must be updated automatically at regular intervals following industry best practices.

9. **Database Session Creation**: Actual database sessions must only be created when the first message is sent, not when the placeholder is created.

### Non-functional Requirements

1. **Performance**: UI updates must be immediate and not cause interface lag.

2. **Consistency**: Must maintain compatibility with existing chat state management patterns in the codebase.

3. **Error Handling**: AI title generation failures must be handled gracefully without disrupting the chat experience.

## Existing Codebase References

### Related Components, Services, Data Models, Types, and Utilities

- **ChatHistory Component** - Location: `components/features/chat/chat-history.tsx` - Contains the current "New Chat" button implementation that needs redesigning
- **ChatContext** - Location: `contexts/chat-context.tsx` - Manages chat state and session selection logic that needs updating for placeholder behavior
- **useChatHistory Hook** - Location: `hooks/useChatHistory.ts` - Contains timestamp formatting logic and session management
- **Chat Handlers** - Location: `lib/api/chat-handlers.ts` - Contains current title generation logic that needs AI enhancement
- **generateChatTitle Function** - Location: `lib/database/supabase.ts` - Current truncation-based title generation to be used as fallback
- **formatRelativeDate Function** - Location: `utils/date.ts` - Current timestamp formatting logic that needs regular update mechanism
- **useChat Hook** - Location: `hooks/useChat.ts` - Manages session creation and AI integration
- **Chat API Route** - Location: `app/api/chat/route.ts` - API endpoint where AI title generation will be triggered

### Pattern References

- **MUST FOLLOW existing error handling patterns** from `lib/error-handling.ts` for AI title generation failures
- **MUST FOLLOW existing state management patterns** from `contexts/chat-context.tsx` for placeholder state handling
- **MUST FOLLOW existing AI provider integration patterns** from `lib/models.ts` for Anthropic model usage

## Dependencies

- **Anthropic API access** for AI title generation (cheapest reasonable model)
- **Existing Vercel AI SDK** integration for model communication

## Risks

- **AI Title Generation Failures**: If the Anthropic API is unavailable or fails, the system must gracefully fall back to the current truncation method
- **Timestamp Update Performance**: Automatic timestamp updates across all sessions could impact performance if not implemented efficiently
- **Placeholder State Management**: Temporary placeholders could cause confusion if not properly cleaned up or if the user navigates away

## Important Observations

- The current system creates database sessions only when the first message is sent, which aligns with the requirement for temporary placeholders
- The existing `generateChatTitle` function provides a reliable fallback mechanism for title generation
- The chat context already handles session selection and state management, requiring minimal changes to support placeholder behavior
- Real-time UI updates are critical for user experience, particularly for the title animation and immediate placeholder creation
