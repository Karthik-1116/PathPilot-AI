import "server-only";

import { cache } from "react";
import { createClient } from "./server";

export interface ProfileSummary {
  fullName: string;
  avatarUrl: string | null;
  createdAt: string | null;
}

export const getProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, created_at")
    .eq("id", userId)
    .maybeSingle();

  return {
    profile: data
      ? {
          fullName:
            typeof data.full_name === "string" ? data.full_name.trim() : "",
          avatarUrl:
            typeof data.avatar_url === "string" ? data.avatar_url : null,
          createdAt:
            typeof data.created_at === "string" ? data.created_at : null,
        }
      : null,
    error,
  };
});
