import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./supabase-ocTNi26f.mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AuthProvider } from "./auth-Cwrqn4MW.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as ThemeProvider } from "./theme-Dbu-6CAw.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Analytics } from "../_libs/vercel__analytics.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BnhmkoFz.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Pvcbfg7f.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Habits Grid" },
			{
				name: "description",
				content: "Track daily habits with a spreadsheet-style grid. Tick cells, watch streaks grow, and build consistency."
			},
			{
				property: "og:title",
				content: "Habits Grid"
			},
			{
				property: "og:description",
				content: "Track daily habits with a spreadsheet-style grid. Tick cells, watch streaks grow, and build consistency."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:site_name",
				content: "Habits Grid"
			},
			{
				property: "og:url",
				content: "https://habitsgrid.pro"
			},
			{
				property: "og:image",
				content: "https://habitsgrid.pro/og.png?v=4"
			},
			{
				property: "og:image:width",
				content: "1200"
			},
			{
				property: "og:image:height",
				content: "630"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Habits Grid"
			},
			{
				name: "twitter:description",
				content: "Track daily habits with a spreadsheet-style grid. Tick cells, watch streaks grow, and build consistency."
			},
			{
				name: "twitter:image",
				content: "https://habitsgrid.pro/og.png?v=4"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			defer: true,
			"data-website-id": "dfid_TviZnB7jqhu0vWvSHp9IH",
			"data-domain": "habitsgrid.pro",
			src: "https://datafa.st/js/script.js"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Analytics, {})
		] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { position: "bottom-right" })]
	});
}
var $$splitComponentImporter$2 = () => import("./routes-DvQzDLzf.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Habits Grid — Track Daily Habits" },
		{
			name: "description",
			content: "A spreadsheet-style habit tracker: every habit is a row, every day a column. Tick cells, watch streak counts and monthly goal progress fill in."
		},
		{
			property: "og:title",
			content: "Habits Grid — Track Daily Habits"
		},
		{
			property: "og:description",
			content: "A spreadsheet-style habit tracker: every habit is a row, every day a column. Tick cells and watch your month fill in."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./onboarding-DaRD6d6d.mjs");
var Route$2 = createFileRoute("/onboarding")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./billing-Ci7GAQei.mjs");
var Route$1 = createFileRoute("/settings/billing")({
	head: () => ({ meta: [{ title: "Billing — Habits Grid" }, {
		name: "description",
		content: "Manage your Habits Grid subscription and plan."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function mapStatus(lsStatus) {
	switch (lsStatus) {
		case "active": return "active";
		case "cancelled": return "cancelled";
		case "expired": return "expired";
		case "paused": return "cancelled";
		default: return "inactive";
	}
}
async function fetchCustomerEmail(apiKey, subscriptionId) {
	try {
		const subRes = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`, { headers: {
			Authorization: `Bearer ${apiKey}`,
			Accept: "application/json"
		} });
		if (!subRes.ok) return null;
		const customerId = (await subRes.json()).data?.attributes?.customer_id;
		if (!customerId) return null;
		const custRes = await fetch(`https://api.lemonsqueezy.com/v1/customers/${customerId}`, { headers: {
			Authorization: `Bearer ${apiKey}`,
			Accept: "application/json"
		} });
		if (!custRes.ok) return null;
		return (await custRes.json()).data?.attributes?.email ?? null;
	} catch {
		return null;
	}
}
var Route = createFileRoute("/api/webhooks/lemonsqueezy")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const body = await request.text();
		const event = JSON.parse(body);
		const eventName = event.meta?.event_name;
		const attrs = event.data?.attributes;
		console.log(`[Webhook] Event: ${eventName}, id: ${event.data?.id}`);
		console.log(`[Webhook] meta.custom_data:`, JSON.stringify(event.meta?.custom_data));
		console.log(`[Webhook] attrs.custom_data:`, JSON.stringify(attrs?.custom_data));
		console.log(`[Webhook] attrs.status:`, attrs?.status, `subscription_id:`, attrs?.subscription_id);
		if (!supabase) {
			console.error("[Webhook] Supabase not configured");
			return new Response(JSON.stringify({ error: "Supabase not configured" }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
		let userId = event.meta?.custom_data?.user_id ?? attrs?.custom_data?.user_id;
		if (userId) console.log(`[Webhook] Found user_id from custom_data: ${userId}`);
		if (!userId) {
			const apiKey = process.env["LEMONSQUEEZY_API_KEY"];
			if (apiKey) {
				const email = await fetchCustomerEmail(apiKey, String(attrs?.subscription_id || event.data.id));
				console.log(`[Webhook] Customer email from API: ${email}`);
				if (email) {
					const { data: pending } = await supabase.from("subscriptions").select("user_id").eq("email", email).eq("status", "pending").maybeSingle();
					userId = pending?.user_id;
					console.log(`[Webhook] Found user_id from email fallback: ${userId ?? "NONE"}`);
				}
			}
		}
		if (!userId) {
			console.error("[Webhook] No user_id found — skipping");
			return new Response(JSON.stringify({
				received: true,
				reason: "no user_id"
			}), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			});
		}
		let rawStatus = attrs.status;
		if (eventName === "subscription_payment_success" && rawStatus !== "active") {
			rawStatus = "active";
			console.log(`[Webhook] Overriding status for ${eventName} to active`);
		}
		const status = mapStatus(rawStatus);
		const lemonSqueezyId = String(attrs?.subscription_id || event.data.id);
		const { error } = await supabase.from("subscriptions").upsert({
			user_id: userId,
			lemon_squeezy_id: lemonSqueezyId,
			email: null,
			status,
			plan_id: String(attrs.product_id),
			variant_id: String(attrs.variant_id),
			renews_at: attrs.renews_at,
			expires_at: attrs.expires_at
		}, { onConflict: "user_id" });
		if (error) {
			console.error("[Webhook] Supabase error:", error.message, error.code);
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
		console.log(`[Webhook] Saved: user ${userId} -> ${status}`);
		return new Response(JSON.stringify({ received: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		console.error("[Webhook] Error:", error);
		return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} } } });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	OnboardingRoute: Route$2.update({
		id: "/onboarding",
		path: "/onboarding",
		getParentRoute: () => Route$4
	}),
	SettingsBillingRoute: Route$1.update({
		id: "/settings/billing",
		path: "/settings/billing",
		getParentRoute: () => Route$4
	}),
	ApiWebhooksLemonsqueezyRoute: Route.update({
		id: "/api/webhooks/lemonsqueezy",
		path: "/api/webhooks/lemonsqueezy",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
