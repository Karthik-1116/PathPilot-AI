type ClassValue = string | false | null | undefined;

/**
 * Joins conditional class names. Kept intentionally small so the styling
 * utilities stay easy to understand.
 */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
