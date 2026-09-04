import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as isSupabaseConfigured } from "./supabase-ocTNi26f.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-Cwrqn4MW.mjs";
import { t as createCheckoutSession } from "./checkout-BGVtvA_y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as ArrowRight, h as Cloud } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-flow-CTkbpRoh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OnboardingFlow({ onDemo }) {
	const navigate = useNavigate();
	const { user, loading: authLoading, isPro, signInWithGoogle } = useAuth();
	const [step, setStep] = (0, import_react.useState)(1);
	const [googleBusy, setGoogleBusy] = (0, import_react.useState)(false);
	const [checkoutBusy, setCheckoutBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!authLoading && isPro) navigate({ to: "/" });
	}, [
		authLoading,
		isPro,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!authLoading && user && step === 1) setStep(2);
	}, [
		user,
		authLoading,
		step
	]);
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-xs text-muted-foreground",
			children: "Loading..."
		})
	});
	const handleGoogleSignIn = async () => {
		if (googleBusy) return;
		setGoogleBusy(true);
		const err = await signInWithGoogle();
		if (err) {
			toast.error(err);
			setGoogleBusy(false);
		}
	};
	const handleUpgrade = async () => {
		if (!user || checkoutBusy) return;
		setCheckoutBusy(true);
		try {
			const result = await createCheckoutSession({ data: {
				userId: user.id,
				email: user.email
			} });
			if (result?.url) window.location.href = result.url;
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to start checkout.");
			setCheckoutBusy(false);
		}
	};
	const handleTryDemo = () => {
		if (onDemo) onDemo();
		else navigate({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center gap-2",
					children: [1, 2].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 rounded-full transition-all ${s <= step ? "w-8 bg-primary" : "w-4 bg-muted"}` }, s))
				}),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-mono text-sm font-semibold uppercase tracking-[0.2em] text-foreground",
								children: "Sign in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Sign in to sync your habits across devices."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: googleBusy || !isSupabaseConfigured,
							onClick: handleGoogleSignIn,
							className: "flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-secondary disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								className: "size-4",
								viewBox: "0 0 24 24",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
										fill: "#4285F4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
										fill: "#34A853"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
										fill: "#FBBC05"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
										fill: "#EA4335"
									})
								]
							}), googleBusy ? "Working..." : "Sign in with Google"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleTryDemo,
							className: "font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground",
							children: "Skip — try demo"
						})
					]
				}),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-mono text-sm font-semibold uppercase tracking-[0.2em] text-foreground",
								children: "Upgrade"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Unlock cloud sync to access your habits from any device."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-border p-4 text-left",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "mt-0.5 size-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Cloud Sync & Backup"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Your habits are backed up and synced across all your devices."
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleUpgrade,
							disabled: checkoutBusy,
							className: "flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
							children: [checkoutBusy ? "Redirecting to checkout..." : "Upgrade to Pro", !checkoutBusy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleTryDemo,
							className: "font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground",
							children: "Skip — try demo"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { OnboardingFlow as t };
