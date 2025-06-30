/**
 * Formats a date string into a human-readable relative time format
 * @param dateString ISO date string to format
 * @param timezone Optional timezone for date conversion
 * @returns Formatted relative time string (e.g., "Just now", "2h ago", "3d ago")
 */
export function formatRelativeDate(dateString: string, timezone?: string): string {
  if (!dateString) {
    return "Unknown";
  }
  
  const date = timezone ? 
    new Date(new Date(dateString).toLocaleString("en-US", { timeZone: timezone })) :
    new Date(dateString);
  
  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  // Handle future dates
  if (diffInHours < 0) {
    return "In the future";
  }

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 24 * 7) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
} 