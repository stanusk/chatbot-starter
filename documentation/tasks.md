# Project Refactoring Tasks

This document outlines the recommended improvements for better code organization, maintainability, and adherence to Next.js/React best practices.

## High Priority Tasks

### Task 1: Migrate to Professional Design System ✅ COMPLETED

**What**: Migrate from ad-hoc Tailwind classes to a proper design system using shadcn/ui best practices
**Why**: Current styling approach uses scattered Tailwind classes without centralized configuration, making it hard to maintain consistency and follow design best practices. A proper design system will provide better maintainability, accessibility, and developer experience.

**Scope**: Complete migration following the detailed plan in [STYLING_MIGRATION_PLAN.md](../STYLING_MIGRATION_PLAN.md)

**Key Deliverables**:

- Proper shadcn/ui component library setup
- Centralized design tokens and theme configuration
- Consistent component patterns with reusable UI primitives
- Migration of all existing components to use the design system
- Documentation and style guides for future development

**Expected Benefits**:

- Unified color palette and consistent spacing/typography
- Better accessibility with Radix UI primitives
- Type-safe styling with proper IntelliSense support
- Optimized CSS bundle size and performance
- Professional, maintainable codebase following industry standards

### Task 2: Extract Custom Hooks from Components ✅ COMPLETED

**What**: Move business logic from components into reusable custom hooks
**Why**: Components are currently mixing UI rendering with business logic, making them hard to test and maintain. Custom hooks will separate concerns and make logic reusable.

**Target Components**:

- Extract auth logic from `components/auth.tsx` into `useAuth` hook
- Extract chat functionality from `components/chat.tsx` into `useChat` hook
- Extract chat history management from `components/chat-history.tsx` into `useChatHistory` hook
- Extract Supabase operations into `useSupabase` hook

### Task 3: Break Down Large Components ✅ COMPLETED

**What**: Split oversized components into smaller, focused components
**Why**: Large components violate the Single Responsibility Principle and are harder to understand, test, and maintain.

**Target Components**:

- `components/chat.tsx` (99 lines) - ✅ Already well-structured, uses `useChat` hook
- `app/page.tsx` (79 lines) - ✅ Extracted Sidebar, MobileHeader, and MainContent components
- `components/auth.tsx` (104 lines) - ✅ Already well-structured, uses `useAuth` hook

**Completed Work**:

- Created `components/layout/` directory with focused components:
  - `Sidebar` - Handles sidebar layout, auth, and chat history
  - `MobileHeader` - Handles mobile navigation header
  - `MainContent` - Orchestrates main content area
- Reduced `app/page.tsx` from 121 to 79 lines
- Improved component separation of concerns
- Added proper TypeScript interfaces and prop definitions
- Used design system tokens for consistent styling
- Added accessibility improvements (aria-labels)
- Created barrel exports for clean imports

### Task 4: Centralize Type Definitions ✅ COMPLETED

**What**: Create a dedicated `types/` directory for all TypeScript interfaces and types
**Why**: Types are currently scattered across files, making them hard to find and reuse. Centralized types improve maintainability and consistency.

**Completed Work**:

- Created `types/` directory with organized type definitions:

  - `types/database.ts` - Database types for Supabase schema
  - `types/models.ts` - AI model types and configurations
  - `types/hooks.ts` - Custom hook return types
  - `types/components.ts` - Component prop types
  - `types/api.ts` - API request/response types
  - `types/ui.ts` - UI component types
  - `types/index.ts` - Main barrel export file

- Updated all existing files to import from centralized types
- Maintained backward compatibility with legacy type names
- Fixed all TypeScript compilation errors
- Cleaned up unused imports and resolved linting issues

**Benefits Achieved**:

- Improved type discoverability and reusability
- Better IntelliSense support for developers
- Consistent type definitions across the codebase
- Easier maintenance and refactoring of types
- Clear separation between different type categories

## Medium Priority Tasks

### Task 5: Implement Proper State Management ✅ COMPLETED

**What**: Establish clear patterns for state management using React Context or state management library
**Why**: State is currently managed at multiple levels without clear data flow, making it hard to track and debug state changes.

**Completed Work**:

- **Authentication Context**: Centralized user authentication state with `AuthProvider` and `useAuthContext`

  - Eliminated duplicate auth logic in `useAuth` and `useChat` hooks
  - Provides consistent auth state across all components
  - Handles sign-in/sign-out operations globally

- **Chat Context**: Centralized chat session and UI state management with `ChatProvider` and `useChatContext`

  - Manages selected session ID and messages
  - Controls sidebar open/close state
  - Handles chat updates and session selection
  - Provides centralized chat history reference

- **UI Context**: Global UI state management with `UIProvider` and `useUIContext`

  - Manages global loading states with optional messages
  - Handles global error states with user-friendly display
  - Provides consistent UI feedback patterns

- **Error Boundary**: Added robust error handling with `ErrorBoundary` component

  - Catches and displays context-related errors gracefully
  - Provides recovery options for users
  - Shows detailed error information in development mode

- **Centralized Provider Setup**: Created `AppProvider` that combines all contexts
  - Proper provider nesting order (UI → Auth → Chat)
  - Integrated error boundary for comprehensive error handling
  - Clean setup in root layout with single provider

**Benefits Achieved**:

- Eliminated prop drilling throughout the component tree
- Consistent state management patterns across the application
- Centralized error handling and user feedback
- Improved developer experience with clear context boundaries
- Better separation of concerns between UI, auth, and chat state
- Type-safe context usage with proper TypeScript definitions

**Files Created/Modified**:

- `contexts/auth-context.tsx` - Authentication state management
- `contexts/chat-context.tsx` - Chat session and UI state management
- `contexts/ui-context.tsx` - Global UI state management
- `contexts/app-provider.tsx` - Combined provider setup
- `contexts/index.ts` - Barrel exports for clean imports
- `types/contexts.ts` - TypeScript definitions for context types
- `components/error-boundary.tsx` - Error boundary component
- `components/global-ui-indicators.tsx` - Global UI state indicators
- Updated `app/layout.tsx`, `app/page.tsx`, `components/auth.tsx`, `components/layout/sidebar.tsx`
- Updated hook files to use contexts instead of duplicating logic

### Task 6: Refactor API Route Organization ✅ COMPLETED

**What**: Break down the large API route into smaller, focused functions
**Why**: Current `app/api/chat/route.ts` (132 lines) handles too many responsibilities, making it hard to maintain and test.

**Completed Work**:

- **Extracted Chat Handler Functions**: Created `lib/api/chat-handlers.ts` with focused functions:

  - `handleSessionManagement()` - Session creation and management logic
  - `handleUserMessagePersistence()` - User message saving and title generation
  - `handleAssistantMessagePersistence()` - Assistant message saving with metadata
  - `handleTitleGeneration()` - Chat title generation logic
  - `createStreamingConfig()` - AI streaming configuration setup

- **Refactored Main API Route**: Reduced `app/api/chat/route.ts` from 127 to 61 lines

  - Clean separation of concerns with focused handler functions
  - Improved readability and maintainability
  - Better error handling isolation
  - Type-safe function interfaces

- **Added Type Definitions**: Enhanced `types/api.ts` with:

  - `AIStreamResult` interface for proper AI streaming response typing
  - Better type safety for handler function parameters

- **Created API Utilities Structure**:
  - `lib/api/` directory for API-related utilities
  - Barrel exports in `lib/api/index.ts` for clean imports
  - Follows project patterns for organized code structure

**Benefits Achieved**:

- **Better Maintainability**: Each function has a single responsibility
- **Improved Testability**: Functions can be tested independently
- **Enhanced Readability**: Main API route is now focused on orchestration
- **Type Safety**: Proper TypeScript interfaces for all parameters
- **Reusability**: Handler functions can be reused in other API routes
- **Error Isolation**: Better error handling with focused try/catch blocks

### Task 7: Improve Error Handling Consistency

**What**: Implement centralized error handling patterns across the application
**Why**: Error handling is currently inconsistent - some areas use console.error, others use toast notifications, with no unified approach.

**Areas to Standardize**:

- API error responses
- Database operation errors
- Authentication errors
- Component error boundaries

## Low Priority Tasks

### Task 8: Reorganize Directory Structure

**What**: Create a more organized folder structure with proper separation of concerns
**Why**: Current structure mixes different types of code without clear boundaries, making navigation and maintenance harder.

**Proposed Structure**:

- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `utils/` - Pure utility functions
- `constants/` - Application constants
- `contexts/` - React context providers
- `components/ui/` - Reusable UI components
- `components/features/` - Feature-specific components

```text
src/
├── app/
├── components/
│ ├── ui/ # Reusable UI components
│ ├── features/ # Feature-specific components
│ └── layout/ # Layout components
├── hooks/ # Custom hooks
├── lib/
│ ├── api/ # API utilities
│ ├── auth/ # Auth utilities
│ └── database/ # Database utilities
├── types/ # TypeScript definitions
├── utils/ # Pure utility functions
└── constants/ # App constants
```

### Task 9: Add Missing Infrastructure Components

**What**: Implement essential React patterns that are currently missing
**Why**: These patterns improve user experience and application reliability.

**Components to Add**:

- Error boundary components for graceful error handling
- Loading state management system
- Toast notification system improvements
- Proper hydration handling

### Task 10: Implement Barrel Exports

**What**: Add index.ts files to directories for cleaner import statements
**Why**: Current imports are verbose and tightly coupled to file structure. Barrel exports provide cleaner APIs and easier refactoring.

**Directories to Add Barrel Exports**:

- `components/` directory
- `hooks/` directory (once created)
- `utils/` directory (once created)
- `types/` directory (once created)

### Task 11: Enhance TypeScript Configuration

**What**: Improve TypeScript configuration for better type safety
**Why**: Current configuration could be stricter to catch more potential issues at compile time.

**Areas to Improve**:

- Enable strict mode configurations
- Add path mapping for cleaner imports
- Improve type checking for Supabase operations
- Add proper typing for AI SDK usage

## Implementation Notes

- Tasks should be implemented in the order listed (High → Medium → Low priority)
- Each task should be completed fully before moving to the next
- Consider creating feature branches for each major task
- Test thoroughly after each refactoring to ensure no functionality is broken
- Update documentation as changes are made

## Success Criteria

After completing these tasks, the project should have:

- Clear separation of concerns between UI and business logic
- Reusable custom hooks for common operations
- Consistent error handling patterns
- Improved type safety and IntelliSense support
- Better code organization and maintainability
- Easier testing and debugging capabilities
