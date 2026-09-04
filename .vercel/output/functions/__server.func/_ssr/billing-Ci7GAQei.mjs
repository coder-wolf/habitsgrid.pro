import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { E as Slot, N as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, l as Trigger2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-Cwrqn4MW.mjs";
import { n as createSsrRpc, t as createCheckoutSession } from "./checkout-BGVtvA_y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as Cloud, t as X, u as ExternalLink, x as ArrowLeft, y as Check } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as UpgradeDialog } from "./upgrade-dialog-84WUY_eV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-Ci7GAQei.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var cancelSubscription = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("5df4f6d2eecf7d8582915e5d2837cb95e223d10e19b3f479fe72f87643bbc82d"));
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var AlertDialog = Root2;
var AlertDialogTrigger = Trigger2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function BillingPage() {
	const { user, subscription, isPro, loading, refresh } = useAuth();
	const navigate = useNavigate();
	const [upgradeOpen, setUpgradeOpen] = (0, import_react.useState)(false);
	const [loadingCheckout, setLoadingCheckout] = (0, import_react.useState)(false);
	const [cancelling, setCancelling] = (0, import_react.useState)(false);
	const upgraded = new URLSearchParams(window.location.search).get("upgraded") === "true";
	(0, import_react.useEffect)(() => {
		if (!upgraded || !user) return;
		let cancelled = false;
		let attempts = 0;
		const maxAttempts = 6;
		const tryRefresh = async () => {
			if (cancelled) return;
			await refresh();
			attempts++;
			if (attempts < maxAttempts) setTimeout(tryRefresh, 2e3);
			else window.history.replaceState({}, "", "/settings/billing");
		};
		const t = setTimeout(tryRefresh, 1500);
		return () => {
			cancelled = true;
			clearTimeout(t);
		};
	}, [upgraded, user]);
	(0, import_react.useEffect)(() => {
		if (upgraded && isPro) {
			toast.success("Welcome to Pro! Cloud sync is now active.");
			navigate({ to: "/" });
		}
	}, [upgraded, isPro]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading..."
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold text-foreground",
					children: "Sign in required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Please sign in to manage your subscription."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/onboarding",
					className: "mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
					children: "Sign in"
				})
			]
		})
	});
	const handleUpgrade = async () => {
		setLoadingCheckout(true);
		try {
			const result = await createCheckoutSession({ data: {
				userId: user.id,
				email: user.email
			} });
			if (result?.url) window.location.href = result.url;
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to start checkout.");
		} finally {
			setLoadingCheckout(false);
		}
	};
	const handleCancel = async () => {
		setCancelling(true);
		try {
			const result = await cancelSubscription({ data: { userId: user.id } });
			await refresh();
			const endsAt = result?.ends_at ? new Date(result.ends_at).toLocaleDateString() : null;
			toast.success(endsAt ? `Subscription cancelled. Access until ${endsAt}.` : "Subscription cancelled.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to cancel subscription.");
		} finally {
			setCancelling(false);
		}
	};
	const statusLabel = subscription?.status ?? "inactive";
	const isActive = statusLabel === "active";
	const isCancelled = statusLabel === "cancelled";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl px-4 py-12 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back to habits"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-foreground",
					children: "Billing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Manage your subscription and plan."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-medium text-foreground",
									children: "Current Plan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-2xl font-semibold text-foreground",
									children: isPro ? "Pro" : "Free"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `rounded-full px-3 py-1 text-xs font-medium ${isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : isCancelled ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-muted text-muted-foreground"}`,
									children: statusLabel
								})]
							}), isPro && (subscription?.created_at || subscription?.renews_at || subscription?.expires_at) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-2 border-t border-border pt-4",
								children: [
									subscription?.created_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Billing cycle started"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: new Date(subscription.created_at).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric"
											})
										})]
									}),
									subscription?.renews_at && !isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Next renewal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: new Date(subscription.renews_at).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric"
											})
										})]
									}),
									subscription?.expires_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: isCancelled ? "Access expires" : "Current period ends"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: new Date(subscription.expires_at).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric"
											})
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-border bg-surface p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium text-foreground",
								children: "Pro Features"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 space-y-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "size-4 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 text-sm text-foreground",
											children: "Cloud Sync & Backup"
										}),
										isPro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-green-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-muted-foreground/50" })
									]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [!isPro ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleUpgrade,
								disabled: loadingCheckout,
								className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), loadingCheckout ? "Redirecting..." : "Upgrade to Pro"]
							}) : isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: cancelling,
									className: "inline-flex items-center gap-2 rounded-md border border-destructive/30 bg-surface px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50",
									children: cancelling ? "Cancelling..." : "Cancel Subscription"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Cancel subscription?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
								"Your Pro access will remain until the end of the current billing period",
								subscription?.expires_at || subscription?.renews_at ? ` (${new Date(subscription.expires_at || subscription.renews_at).toLocaleDateString()})` : "",
								". It will be cancelled on LemonSqueezy as well."
							] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Keep Pro" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
								onClick: handleCancel,
								className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
								children: "Confirm Cancel"
							})] })] })] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									refresh().then(() => toast.success("Refreshed subscription status."));
								},
								className: "inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary",
								children: "Refresh billing status"
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpgradeDialog, {
			open: upgradeOpen,
			onOpenChange: setUpgradeOpen
		})]
	});
}
//#endregion
export { BillingPage as component };
