import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { n as supabase } from "./supabase-ocTNi26f.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { t as getRequest } from "./request-response-BEPp1C2k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-D0quu2co.js
var createCheckoutSession_createServerFn_handler = createServerRpc({
	id: "93a804ab06e45560dbb0c5e1f040dd61608b70d51751ea73b7cd35e81d73536d",
	name: "createCheckoutSession",
	filename: "src/lib/checkout.ts"
}, (opts) => createCheckoutSession.__executeServer(opts));
var createCheckoutSession = createServerFn({ method: "POST" }).validator((data) => data).handler(createCheckoutSession_createServerFn_handler, async ({ data }) => {
	const LEMONSQUEEZY_API_KEY = process.env["LEMONSQUEEZY_API_KEY"];
	const LEMONSQUEEZY_STORE_ID = process.env["LEMONSQUEEZY_STORE_ID"];
	const LEMONSQUEEZY_VARIANT_ID = process.env["LEMONSQUEEZY_VARIANT_ID"];
	if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID || !LEMONSQUEEZY_VARIANT_ID) throw new Error("LemonSqueezy is not configured.");
	if (supabase) {
		const pendingId = `pending-${crypto.randomUUID()}`;
		await supabase.from("subscriptions").upsert({
			user_id: data.userId,
			email: data.email,
			lemon_squeezy_id: pendingId,
			status: "pending",
			plan_id: "0",
			variant_id: "0"
		}, { onConflict: "user_id" });
	}
	const origin = getRequest()?.headers.get("origin") ?? "https://habitsgrid.pro";
	const response = await fetch(`https://api.lemonsqueezy.com/v1/checkouts`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({ data: {
			type: "checkouts",
			attributes: {
				checkout_data: {
					email: data.email,
					custom: { user_id: data.userId }
				},
				product_options: { redirect_url: `${origin}/settings/billing?upgraded=true&uid=${data.userId}` }
			},
			relationships: {
				store: { data: {
					type: "stores",
					id: LEMONSQUEEZY_STORE_ID
				} },
				variant: { data: {
					type: "variants",
					id: LEMONSQUEEZY_VARIANT_ID
				} }
			}
		} })
	});
	if (!response.ok) {
		const body = await response.text();
		console.error("LemonSqueezy checkout error:", body);
		throw new Error("Failed to create checkout session.");
	}
	return { url: (await response.json()).data.attributes.url };
});
//#endregion
export { createCheckoutSession_createServerFn_handler };
