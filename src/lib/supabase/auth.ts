import "server-only";

import { cache } from "react";
import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";

export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;

  return data.user;
});
