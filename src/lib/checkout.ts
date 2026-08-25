import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { supabase } from "@/lib/supabase";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: { userId: string; email: string }) => data)
  .handler(async ({ data }) => {
    const LEMONSQUEEZY_API_KEY = process.env["LEMONSQUEEZY_API_KEY"];
    const LEMONSQUEEZY_STORE_ID = process.env["LEMONSQUEEZY_STORE_ID"];
    const LEMONSQUEEZY_VARIANT_ID = process.env["LEMONSQUEEZY_VARIANT_ID"];

    if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID || !LEMONSQUEEZY_VARIANT_ID) {
      throw new Error("LemonSqueezy is not configured.");
    }

    // Store pending subscription with user_id and email for webhook matching
    if (supabase) {
      const pendingId = `pending-${crypto.randomUUID()}`;
      await supabase.from("subscriptions").upsert(
        {
          user_id: data.userId,
          email: data.email,
          lemon_squeezy_id: pendingId,
          status: "pending",
          plan_id: "0",
          variant_id: "0",
        },
        { onConflict: "user_id" },
      );
    }

    const request = getRequest();
    const origin = request?.headers.get("origin") ?? "http://localhost:3000";

    const response = await fetch(`https://api.lemonsqueezy.com/v1/checkouts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: data.email,
              custom: {
                user_id: data.userId,
              },
            },
            product_options: {
              redirect_url: `${origin}/settings/billing?upgraded=true`,
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: LEMONSQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: LEMONSQUEEZY_VARIANT_ID,
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("LemonSqueezy checkout error:", body);
      throw new Error("Failed to create checkout session.");
    }

    const result = await response.json();
    return { url: result.data.attributes.url as string };
  });
