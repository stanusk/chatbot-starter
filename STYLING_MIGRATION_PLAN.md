# Styling Migration Plan: AI SDK Reasoning Starter

## 🎯 Goal

Migrate from ad-hoc Tailwind classes to a proper design system using shadcn/ui best practices, with centralized configuration and consistent styling patterns.

## 📋 Current State Analysis

### ✅ What We Have

- Tailwind CSS configured and working
- shadcn/ui partially initialized (components.json, design tokens in globals.css)
- Custom components with inline Tailwind classes
- Dark mode support via CSS variables
- Framer Motion for animations
- Sonner for toast notifications

### ❌ What's Missing

- Proper shadcn/ui component library setup
- Centralized design tokens and theme configuration
- Consistent component patterns
- Reusable UI primitives
- Design system documentation

## 🚀 Migration Tasks

### Phase 1: Foundation Setup

#### 1.1 Fix shadcn/ui Installation

- [ ] **Issue**: shadcn CLI trying to use pnpm instead of npm
- [ ] **Solution**: Manual installation of dependencies
- [ ] **Commands**:
  ```bash
  npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu
  npm install @radix-ui/react-toast @radix-ui/react-separator
  ```

#### 1.2 Create Design System Configuration

- [ ] **Extend Tailwind config** with custom design tokens:
  ```typescript
  // tailwind.config.ts
  export default {
    theme: {
      extend: {
        colors: {
          // Use shadcn/ui color system
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          // Add custom app colors
          chat: {
            user: "hsl(var(--chat-user))",
            assistant: "hsl(var(--chat-assistant))",
            reasoning: "hsl(var(--chat-reasoning))",
          },
        },
        spacing: {
          // Consistent spacing scale
          "18": "4.5rem",
          "88": "22rem",
        },
        animation: {
          // Custom animations for chat
          "message-in": "slideInFromRight 0.3s ease-out",
          thinking: "pulse 2s infinite",
        },
      },
    },
  };
  ```

#### 1.3 Add Custom CSS Variables

- [ ] **Extend globals.css** with app-specific design tokens:

  ```css
  @layer base {
    :root {
      /* Chat-specific colors */
      --chat-user: 220 14.3% 95.9%;
      --chat-assistant: 220 14.3% 95.9%;
      --chat-reasoning: 47.9 95.8% 53.1%;

      /* Component-specific tokens */
      --sidebar-width: 320px;
      --header-height: 64px;
      --message-spacing: 1.5rem;
    }

    .dark {
      --chat-user: 220 13% 18%;
      --chat-assistant: 220 13% 18%;
      --chat-reasoning: 47.9 95.8% 53.1%;
    }
  }
  ```

### Phase 2: Core Component Migration

#### 2.1 Create shadcn/ui Base Components

- [ ] **Button component** - Replace all button styling
- [ ] **Input component** - Replace textarea and input styling
- [ ] **Card component** - For chat messages and containers
- [ ] **Dialog component** - For modals and overlays
- [ ] **Dropdown component** - For model selection
- [ ] **Toast component** - Replace sonner with shadcn/ui toast
- [ ] **Separator component** - For visual dividers

#### 2.2 Create Custom App Components

- [ ] **ChatMessage component**:
  ```typescript
  interface ChatMessageProps {
    role: "user" | "assistant" | "system";
    content: string;
    reasoning?: string;
    timestamp: Date;
    isStreaming?: boolean;
  }
  ```
- [ ] **MessageBubble component** - Consistent message styling
- [ ] **ReasoningPanel component** - Collapsible reasoning display
- [ ] **ModelSelector component** - Dropdown with proper styling
- [ ] **ChatInput component** - Enhanced input with better UX

#### 2.3 Layout Components

- [ ] **Sidebar component** - Responsive sidebar with proper animations
- [ ] **Header component** - Consistent header across pages
- [ ] **Container component** - Max-width and padding consistency
- [ ] **LoadingSpinner component** - Consistent loading states

### Phase 3: Component Migration

#### 3.1 Migrate Authentication Components

- [ ] **components/auth.tsx**:
  - Replace custom buttons with `<Button>` component
  - Use `<Card>` for container styling
  - Use `<Input>` for email field
  - Add proper loading states with `<Spinner>`

#### 3.2 Migrate Chat Components

- [ ] **components/chat.tsx**:

  - Use `<Container>` for layout
  - Replace custom styling with design system classes
  - Add consistent spacing using spacing scale

- [ ] **components/chat-history.tsx**:

  - Use `<Card>` for session items
  - Use `<Separator>` between items
  - Add proper hover states and animations

- [ ] **components/input.tsx**:
  - Replace with enhanced `<ChatInput>` component
  - Add proper focus states and accessibility

#### 3.3 Migrate Page Layout

- [ ] **app/page.tsx**:
  - Use layout components (`<Sidebar>`, `<Header>`, `<Container>`)
  - Implement responsive design patterns
  - Add proper mobile navigation

### Phase 4: Design System Documentation

#### 4.1 Create Component Documentation

- [ ] **components/ui/README.md** - Document all UI components
- [ ] **Storybook setup** (optional) - Component playground
- [ ] **Design tokens documentation** - Color, spacing, typography reference

#### 4.2 Create Style Guide

- [ ] **STYLING_GUIDE.md**:
  - Component usage patterns
  - Color system explanation
  - Spacing and layout guidelines
  - Dark mode implementation
  - Animation guidelines

### Phase 5: Best Practices Implementation

#### 5.1 Centralized Styling Patterns

- [ ] **Create variant patterns**:

  ```typescript
  // lib/variants.ts
  import { cva } from "class-variance-authority";

  export const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          outline: "border border-input bg-background hover:bg-accent",
          secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
          chat: "bg-chat-user text-foreground hover:bg-chat-user/90",
        },
        size: {
          default: "h-10 px-4 py-2",
          sm: "h-9 rounded-md px-3",
          lg: "h-11 rounded-md px-8",
          icon: "h-10 w-10",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
  );
  ```

#### 5.2 Consistent Animation Patterns

- [ ] **Create animation utilities**:
  ```typescript
  // lib/animations.ts
  export const chatAnimations = {
    messageIn: "animate-in slide-in-from-right-2 duration-300",
    messageOut: "animate-out slide-out-to-right-2 duration-200",
    thinking: "animate-pulse",
    fadeIn: "animate-in fade-in duration-200",
  };
  ```

#### 5.3 Responsive Design Patterns

- [ ] **Create responsive utilities**:

  ```typescript
  // lib/responsive.ts
  export const breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  };

  export const containerSizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    chat: "max-w-3xl",
  };
  ```

## 🔧 Implementation Strategy

### Step-by-Step Approach

1. **Start with foundation** (Phase 1) - Get the design system properly configured
2. **Build core components** (Phase 2) - Create reusable primitives
3. **Migrate incrementally** (Phase 3) - One component at a time
4. **Document as you go** (Phase 4) - Keep documentation updated
5. **Refine and optimize** (Phase 5) - Apply best practices consistently

### Testing Strategy

- [ ] **Visual regression testing** - Ensure components look correct
- [ ] **Accessibility testing** - Verify keyboard navigation and screen readers
- [ ] **Responsive testing** - Test on different screen sizes
- [ ] **Dark mode testing** - Ensure proper theme switching

## 📁 Expected File Structure After Migration

```
components/
├── ui/                          # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── chat/                        # Chat-specific components
│   ├── chat-message.tsx
│   ├── message-bubble.tsx
│   ├── reasoning-panel.tsx
│   └── chat-input.tsx
├── layout/                      # Layout components
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── container.tsx
└── auth/                        # Auth components
    ├── auth-form.tsx
    └── sign-in-button.tsx

lib/
├── utils.ts                     # className utilities
├── variants.ts                  # Component variants
├── animations.ts                # Animation utilities
└── responsive.ts                # Responsive utilities

styles/
├── globals.css                  # Global styles and design tokens
└── components.css               # Component-specific styles
```

## 🎨 Design System Benefits After Migration

### ✅ Consistency

- Unified color palette across all components
- Consistent spacing and typography
- Standardized interaction patterns

### ✅ Maintainability

- Centralized styling configuration
- Reusable component patterns
- Easy theme customization

### ✅ Accessibility

- Built-in ARIA attributes from Radix UI
- Proper focus management
- Screen reader compatibility

### ✅ Developer Experience

- IntelliSense for design tokens
- Type-safe component props
- Clear component documentation

### ✅ Performance

- Optimized CSS bundle size
- Efficient re-renders
- Proper animation performance

## 🚀 Getting Started

To begin this migration:

1. **Review this plan** and adjust priorities based on your needs
2. **Start with Phase 1** to establish the foundation
3. **Pick one component** from Phase 2 to migrate as a proof of concept
4. **Iterate and refine** the process based on learnings

This migration will transform your app from ad-hoc styling to a professional, maintainable design system that follows industry best practices.
