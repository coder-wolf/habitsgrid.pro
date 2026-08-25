import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/lib/supabase";

export const cancelSubscription = createServerFn({ method: "POST" })
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env["LEMONSQUEEZY_API_KEY"];
    if (!apiKey) throw new Error("LemonSqueezy is not configured.");
    if (!supabase) throw new Error("Supabase is not configured.");

    const { data: sub, error: fetchError } = await supabase
      .from("subscriptions")
      .select("lemon_squeezy_id, status")
      .eq("user_id", data.userId)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);
    if (!sub) throw new Error("No subscription found.");
    if (sub.status !== "active") throw new Error(`Subscription is ${sub.status}, not active.`);
    if (!sub.lemon_squeezy_id || sub.lemon_squeezy_id.startsWith("pending") || sub.lemon_squeezy_id === "undefined") {
      throw new Error("Invalid subscription ID.");
    }

    const res = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${sub.lemon_squeezy_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("LemonSqueezy cancel error:", body);
      throw new Error("Failed to cancel subscription on LemonSqueezy.");
    }

    const result = await res.json();
    const attrs = result.data?.attributes;

    // Update local status to cancelled — webhook will also fire subscription_updated later
    await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        expires_at: attrs?.ends_at ?? attrs?.renews_at ?? null,
        renews_at: attrs?.renews_at ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", data.userId);

    return { success: true, ends_at: attrs?.ends_at ?? null };
  });
