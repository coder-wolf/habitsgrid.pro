import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

type LemonSqueezyEvent = {
  meta: {
    event_name: string;
  };
  data: {
    id: string;
    attributes: {
      user_id: number;
      customer_id: number;
      order_id: number;
      product_id: number;
      variant_id: number;
      status: string;
      renews_at: string | null;
      expires_at: string | null;
      created_at: string;
      updated_at: string;
      custom_data?: Record<string, string>;
    };
  };
};

function mapStatus(lsStatus: string): string {
  switch (lsStatus) {
    case "active":
      return "active";
    case "cancelled":
      return "cancelled";
    case "expired":
      return "expired";
    case "paused":
      return "cancelled";
    default:
      return "inactive";
  }
}

export const Route = createFileRoute("/api/webhooks/lemonsqueezy")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.text();
          const event: LemonSqueezyEvent = JSON.parse(body);
          const eventName = event.meta?.event_name;
          const attrs = event.data?.attributes;

          console.log(`[Webhook] Event: ${eventName}, id: ${event.data?.id}`);
          console.log(`[Webhook] custom_data:`, JSON.stringify(attrs?.custom_data));

          if (!supabase) {
            console.error("[Webhook] Supabase not configured");
            return new Response(JSON.stringify({ error: "Supabase not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Try to get user_id from custom_data
          let userId = attrs?.custom_data?.user_id;

          // If not in custom_data, fetch subscription details from LemonSqueezy API
          if (!userId) {
            const apiKey = process.env["LEMONSQUEEZY_API_KEY"];
            if (apiKey) {
              try {
                const res = await fetch(
                  `https://api.lemonsqueezy.com/v1/subscriptions/${event.data.id}`,
                  { headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" } },
                );
                if (res.ok) {
                  const json = await res.json();
                  userId = json.data?.attributes?.custom_data?.user_id;
                  console.log(`[Webhook] Fetched custom_data from API:`, JSON.stringify(json.data?.attributes?.custom_data));
                }
              } catch (e) {
                console.error("[Webhook] Failed to fetch subscription from API:", e);
              }
            }
          }

          // If still no user_id, look up existing subscription in our DB
          if (!userId) {
            const { data: existing } = await supabase
              .from("subscriptions")
              .select("user_id")
              .eq("lemon_squeezy_id", event.data.id)
              .maybeSingle();
            userId = existing?.user_id;
          }

          if (!userId) {
            console.error("[Webhook] No user_id found — skipping");
            return new Response(JSON.stringify({ received: true, reason: "no user_id" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const status = mapStatus(attrs.status);

          const { error } = await supabase.from("subscriptions").upsert(
            {
              user_id: userId,
              lemon_squeezy_id: event.data.id,
              status,
              plan_id: String(attrs.product_id),
              variant_id: String(attrs.variant_id),
              renews_at: attrs.renews_at,
              expires_at: attrs.expires_at,
            },
            { onConflict: "user_id" },
          );

          if (error) {
            console.error("[Webhook] Supabase error:", error.message, error.code);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          console.log(`[Webhook] Saved: user ${userId} -> ${status}`);
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("[Webhook] Error:", error);
          return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
