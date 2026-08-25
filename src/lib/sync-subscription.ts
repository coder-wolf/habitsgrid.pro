import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/lib/supabase";

export const syncSubscriptionFromLemonSqueezy = createServerFn({ method: "POST" })
  .validator((data: { userId: string; email: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env["LEMONSQUEEZY_API_KEY"];
    if (!apiKey || !supabase) {
      return { success: false, reason: "not_configured" };
    }

    // Search LemonSqueezy customers by email
    const custRes = await fetch(
      `https://api.lemonsqueezy.com/v1/customers?filter[email]=${encodeURIComponent(data.email)}`,
      { headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" } },
    );
    if (!custRes.ok) return { success: false, reason: "api_error" };
    const custJson = await custRes.json();
    const customers = custJson.data ?? [];
    if (customers.length === 0) return { success: false, reason: "no_customer" };

    // For each customer, find active subscriptions
    for (const cust of customers) {
      const subRes = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions?filter[customer_id]=${cust.id}`,
        { headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" } },
      );
      if (!subRes.ok) continue;
      const subJson = await subRes.json();
      const subs = subJson.data ?? [];

      for (const sub of subs) {
        const attrs = sub.attributes;
        if (attrs.status === "active" || attrs.status === "paused") {
          const status = attrs.status === "paused" ? "cancelled" : "active";
          const { error } = await supabase.from("subscriptions").upsert(
            {
              user_id: data.userId,
              email: data.email,
              lemon_squeezy_id: sub.id,
              status,
              plan_id: String(attrs.product_id),
              variant_id: String(attrs.variant_id),
              renews_at: attrs.renews_at,
              expires_at: attrs.expires_at,
            },
            { onConflict: "user_id" },
          );
          if (!error) return { success: true, status };
        }
      }
    }

    return { success: false, reason: "no_active_subscription" };
  });
