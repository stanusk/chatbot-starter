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

### Task 4: Centralize Type Definitions

**What**: Create a dedicated `types/` directory for all TypeScript interfaces and types
**Why**: Types are currently scattered across files, making them hard to find and reuse. Centralized types improve maintainability and consistency.

**Current Issues**:

- Supabase types mixed with utility functions in `lib/supabase.ts`
- Model types in `lib/models.ts`
- Component props defined inline
- No shared interfaces for common data structures

## Medium Priority Tasks

### Task 5: Implement Proper State Management

**What**: Establish clear patterns for state management using React Context or state management library
**Why**: State is currently managed at multiple levels without clear data flow, making it hard to track and debug state changes.

**Areas to Address**:

- User authentication state shared across components
- Chat session state management
- UI state (sidebar open/close, loading states)
- Error state handling

### Task 6: Refactor API Route Organization

**What**: Break down the large API route into smaller, focused functions
**Why**: Current `app/api/chat/route.ts` (132 lines) handles too many responsibilities, making it hard to maintain and test.

**Areas to Split**:

- Session management logic
- Message persistence logic
- AI streaming logic
- Title generation logic

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
