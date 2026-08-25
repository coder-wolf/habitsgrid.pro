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
      custom_data?: {
        user_id?: string;
      };
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

          console.log(`[Webhook] Received event: ${eventName}`);

          const userId = attrs?.custom_data?.user_id;
          if (!userId) {
            console.error("[Webhook] No user_id in custom_data");
            return new Response(JSON.stringify({ received: true, reason: "no user_id" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          const status = mapStatus(attrs.status);

          if (!supabase) {
            console.error("[Webhook] Supabase not configured");
            return new Response(JSON.stringify({ error: "Supabase not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

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
            console.error("[Webhook] Supabase error:", error.message);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          console.log(`[Webhook] ${eventName} for user ${userId} -> ${status}`);
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
