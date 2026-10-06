/**
 * Minimal class joiner. Filters out falsey values so conditional classes read
 * cleanly at the call site. Deliberately dependency-free — we don't need
 * conflict resolution because variants below never overlap on the same prop.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
