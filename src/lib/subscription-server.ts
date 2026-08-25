import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { supabase } from "@/lib/supabase";
import type { Subscription } from "@/lib/subscription";

export const getSubscription = createServerFn({ method: "GET" }).handler(async () => {
  if (!supabase) return null;

  const request = getRequest();
  const cookieHeader = request?.headers.get("cookie") ?? "";

  // Extract access token from cookie (sb-access-token cookie set by Supabase)
  const tokenMatch = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/);
  if (!tokenMatch) return null;

  let token: string;
  try {
    token = JSON.parse(decodeURIComponent(tokenMatch[1]!)).access_token;
  } catch {
    return null;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);
  if (authError || !user) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch subscription:", error.message);
    return null;
  }

  return data as Subscription | null;
});
