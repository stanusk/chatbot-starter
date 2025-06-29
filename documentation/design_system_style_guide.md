# Design System Style Guide

## 🎯 Overview

This style guide documents the design system patterns, principles, and best practices for the AI SDK Reasoning Starter. It ensures consistency, maintainability, and scalability across all components.

## 🎨 Design Principles

### 1. **Consistency First**

- Use design tokens instead of arbitrary values
- Follow established component patterns
- Maintain visual hierarchy

### 2. **Accessibility by Default**

- Use Radix UI primitives for complex interactions
- Ensure proper color contrast
- Support keyboard navigation

### 3. **Performance Conscious**

- Optimize for bundle size
- Use efficient CSS patterns
- Minimize runtime calculations

## 🏗️ Architecture

### Component Hierarchy

```
components/
├── ui/              # Design system primitives (shadcn/ui)
├── features/        # Feature-specific components
└── layout/          # Layout components
```

### Import Patterns

```typescript
// ✅ Good - Use barrel exports
import { Button, Card, Input } from "@/components/ui";

// ❌ Avoid - Direct imports
import { Button } from "@/components/ui/button";
```

## 🎨 Design Tokens

### Colors

Always use CSS custom properties through Tailwind classes:

```typescript
// ✅ Good - Design system colors
className = "bg-background text-foreground";
className = "bg-card text-card-foreground";
className = "bg-primary text-primary-foreground";

// ❌ Avoid - Arbitrary colors
className = "bg-white text-black";
className = "bg-zinc-100 dark:bg-zinc-800";
```

### Chat-Specific Colors

```css
--chat-user: 220 14.3% 95.9%;
--chat-assistant: 220 14.3% 95.9%;
--chat-reasoning: 47.9 95.8% 53.1%;
```

Usage:

```typescript
className = "bg-chat-user text-foreground";
```

### Spacing

Use design system spacing scale:

```typescript
// ✅ Good - Design system spacing
className = "p-4 gap-4 mb-6";
className = "px-3 py-2";

// ✅ Good - Custom spacing tokens
className = "p-18"; // 4.5rem
className = "w-88"; // 22rem

// ❌ Avoid - Arbitrary spacing
className = "p-[12px] gap-[8px]";
```

### Border Radius

```typescript
// ✅ Good - Design system radius
className = "rounded-lg"; // var(--radius)
className = "rounded-md"; // calc(var(--radius) - 2px)
className = "rounded-sm"; // calc(var(--radius) - 4px)
```

## 🧩 Component Patterns

### 1. Variant-Based Components

Use `class-variance-authority` for component variants:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const componentVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "default-classes",
      secondary: "secondary-classes",
    },
    size: {
      default: "default-size",
      sm: "small-size",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

### 2. Composition Patterns

Build complex components through composition:

```typescript
// ✅ Good - Composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Avoid - Monolithic components
<ComplexCard title="Title" content="Content" />
```

### 3. Forwarded Refs

Always use `forwardRef` for UI primitives:

```typescript
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("base-classes", className)} {...props} />
  )
);
Component.displayName = "Component";
```

## 📝 Naming Conventions

### Component Names

- **UI Primitives**: PascalCase (Button, Input, Card)
- **Feature Components**: Descriptive PascalCase (ChatInput, ModelSelector)
- **Layout Components**: Layout-prefixed (LayoutHeader, LayoutSidebar)

### CSS Classes

- **Utilities**: Use Tailwind classes
- **Components**: Use design tokens
- **Custom**: Prefix with component name

### Props

- **Boolean**: Use `is*` or `has*` prefix
- **Handlers**: Use `on*` prefix
- **Data**: Descriptive names

```typescript
interface ComponentProps {
  isLoading?: boolean;
  hasError?: boolean;
  onSubmit?: () => void;
  selectedId?: string;
}
```

## 🎭 State Management Patterns

### Visual States

Always handle these states consistently:

```typescript
// Loading state
<Button disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</Button>

// Error state
<Input className={cn("border-input", hasError && "border-destructive")} />

// Disabled state
<Button disabled={isDisabled} className="disabled:opacity-50" />
```

## 🌗 Dark Mode

### Implementation

- Use CSS custom properties
- Test both light and dark modes
- Ensure proper contrast ratios

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
}
```

## ♿ Accessibility Guidelines

### Focus Management

```typescript
// ✅ Good - Visible focus states
className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

// ✅ Good - Skip to content
<Button variant="ghost" className="sr-only focus:not-sr-only">
  Skip to content
</Button>
```

### ARIA Labels

```typescript
// ✅ Good - Descriptive labels
<Button aria-label="Send message">
  <SendIcon />
</Button>

// ✅ Good - Loading states
<Button aria-busy={isLoading} aria-label={isLoading ? "Sending..." : "Send"}>
  Send
</Button>
```

## 📱 Responsive Design

### Breakpoint Usage

```typescript
// ✅ Good - Mobile-first approach
className = "text-sm md:text-base lg:text-lg";
className = "px-4 md:px-6 lg:px-8";

// ✅ Good - Container patterns
className = "w-full max-w-3xl mx-auto";
```

### Layout Patterns

```typescript
// ✅ Good - Flexible layouts
className = "flex flex-col md:flex-row gap-4";
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
```

## 🚀 Animation Guidelines

### Transitions

```typescript
// ✅ Good - Subtle transitions
className = "transition-colors duration-200";
className = "hover:scale-105 active:scale-95 transition-transform";

// ❌ Avoid - Jarring animations
className = "transition-all duration-1000";
```

### Loading States

```typescript
// ✅ Good - Purposeful animations
className = "animate-pulse";
className = "animate-spin";
```

## 🔧 Development Workflow

### Component Creation Checklist

- [ ] Use design tokens for colors and spacing
- [ ] Implement proper TypeScript types
- [ ] Add forwardRef for DOM elements
- [ ] Include variant system if applicable
- [ ] Test in both light and dark modes
- [ ] Verify accessibility compliance
- [ ] Add to barrel exports

### Code Review Checklist

- [ ] No arbitrary Tailwind values
- [ ] Consistent naming conventions
- [ ] Proper error handling
- [ ] Accessibility considerations
- [ ] Performance implications

## 📚 Examples

### ✅ Good Component Example

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("relative w-full rounded-lg border p-4", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      destructive:
        "border-destructive/50 text-destructive dark:border-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
);
Alert.displayName = "Alert";
```

### ❌ Bad Component Example

```typescript
// Multiple issues: arbitrary values, no variants, poor naming
const MyComponent = ({ data, onClick }) => (
  <div
    className="bg-[#f1f1f1] p-[12px] rounded-[8px] border-[1px] border-[#ccc]"
    onClick={onClick}
  >
    {data}
  </div>
);
```

## 🎯 Migration Checklist

When updating existing components:

- [ ] Replace arbitrary colors with design tokens
- [ ] Use spacing scale instead of custom values
- [ ] Add proper TypeScript types
- [ ] Implement variant system if needed
- [ ] Test accessibility
- [ ] Update imports to use barrel exports
- [ ] Document any breaking changes

---

This style guide should be followed for all new components and used as a reference when refactoring existing ones. It ensures our design system remains consistent, maintainable, and scalable.
