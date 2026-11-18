export function getDisplayName(
  fullName: string | null | undefined,
  email: string | null | undefined,
) {
  const name = (fullName ?? "").trim();

  return name || email?.split("@")[0] || "there";
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "PP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
