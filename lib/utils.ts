import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges class names, resolving Tailwind CSS conflicts and duplicates.
 *
 * Accepts any number of class name values, conditionally joins them, and returns a single optimized class string suitable for use with Tailwind CSS.
 *
 * @returns The merged and deduplicated class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 