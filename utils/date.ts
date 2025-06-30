/**
 * Formats a date string into a human-readable relative time format
 * @param dateString ISO date string to format
 * @returns Formatted relative time string (e.g., "Just now", "2h ago", "3d ago")
 * 
 * Note: Timezone support has been temporarily removed due to unreliable conversion.
 * For proper timezone handling, consider using a dedicated library like date-fns-tz.
 */
export function formatRelativeDate(dateString: string): string {
  if (!dateString) {
    return "Unknown";
  }
  
  // Parse the date string directly - if it's already in ISO format, this is reliable
  // For timezone support, we'd need a proper library like date-fns-tz
  // For now, we'll use the original date without timezone conversion to avoid unreliable parsing
  const date = new Date(dateString);
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = diffInMs / (1000 * 60);
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  // Handle future dates
  if (diffInMs < 0) {
    return "In the future";
  }

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)}d ago`;
  } else {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
} 