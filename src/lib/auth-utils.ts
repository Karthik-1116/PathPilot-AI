export function sanitizeRedirectPath(
  value: string | null | undefined,
  fallback = "/dashboard",
) {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.includes("\\")) return fallback;

  return value;
}

export function isValidEmail(value: string) {
  const email = value.trim();

  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getAuthErrorMessage(message: string | undefined) {
  const normalized = (message ?? "").toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email address before logging in.";
  }

  if (normalized.includes("user already registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }

  if (normalized.includes("database error saving new user")) {
    return "Account setup is incomplete. Run the Phase 2 SQL migration in Supabase, then try again.";
  }

  if (normalized.includes("password should be at least")) {
    return "Password must be at least 8 characters.";
  }

  if (
    normalized.includes("auth session missing") ||
    normalized.includes("session expired") ||
    normalized.includes("refresh token")
  ) {
    return "Your session expired. Log in again to continue.";
  }

  if (normalized.includes("invalid api key") || normalized.includes("invalid jwt")) {
    return "Supabase rejected the API key. Check NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and restart the dev server.";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many requests")
  ) {
    return "Too many attempts. Wait a moment and try again.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("fetch failed") ||
    normalized.includes("network")
  ) {
    return "Could not reach Supabase. Check your connection and environment variables.";
  }

  return "Something went wrong. Please try again.";
}
