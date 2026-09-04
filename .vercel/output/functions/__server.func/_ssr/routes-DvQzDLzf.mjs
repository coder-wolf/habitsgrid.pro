import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase, t as isSupabaseConfigured } from "./supabase-ocTNi26f.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-Cwrqn4MW.mjs";
import { a as closestCenter, h as CSS, i as PointerSensor, m as useSensors, p as useSensor, r as KeyboardSensor, t as DndContext, x as require_react_dom } from "../_libs/@dnd-kit/core+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as ChevronLeft, a as Share2, c as GripVertical, d as Droplets, f as Download, g as ChevronRight, h as Cloud, i as Sun, l as Flower2, m as Cookie, n as TreePine, o as Orbit, p as Disc, r as Sunset, s as Heart, v as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as UpgradeDialog } from "./upgrade-dialog-84WUY_eV.mjs";
import { t as OnboardingFlow } from "./onboarding-flow-CTkbpRoh.mjs";
import { n as useTheme } from "./theme-Dbu-6CAw.mjs";
import { a as verticalListSortingStrategy, i as useSortable, n as arrayMove, r as sortableKeyboardCoordinates, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
import { t as toPng } from "../_libs/html-to-image.mjs";
import { a as Trigger, i as Root2, n as Content2, r as Portal, t as Close } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DvQzDLzf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var PopoverClose = Close;
var themeConfig = {
	light: {
		label: "Light",
		icon: Sun
	},
	midnight: {
		label: "Midnight",
		icon: Cloud
	},
	sunset: {
		label: "Sunset",
		icon: Sunset
	},
	forest: {
		label: "Forest",
		icon: TreePine
	},
	lavender: {
		label: "Lavender",
		icon: Flower2
	},
	pink: {
		label: "Pink",
		icon: Heart
	},
	indigo: {
		label: "Indigo",
		icon: Orbit
	},
	teal: {
		label: "Teal",
		icon: Droplets
	},
	charcoal: {
		label: "Charcoal",
		icon: Disc
	},
	cocoa: {
		label: "Cocoa",
		icon: Cookie
	}
};
var darkThemes = [
	"midnight",
	"indigo",
	"teal",
	"charcoal",
	"cocoa"
];
var lightThemes = [
	"light",
	"sunset",
	"forest",
	"lavender",
	"pink"
];
function ThemeButton({ t, current, onSelect }) {
	const { label, icon: Icon } = themeConfig[t];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverClose, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => onSelect(t),
			className: `flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${current === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), label]
		})
	});
}
function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": "Change theme",
			className: "rounded-md border border-border bg-surface p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
			children: (() => {
				const Icon = themeConfig[theme].icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" });
			})()
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
		align: "end",
		sideOffset: 4,
		className: "w-auto p-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-[120px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground",
						children: "Light"
					}), lightThemes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeButton, {
						t,
						current: theme,
						onSelect: setTheme
					}, t))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-l border-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-[120px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground",
						children: "Dark"
					}), darkThemes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeButton, {
						t,
						current: theme,
						onSelect: setTheme
					}, t))]
				})
			]
		})
	})] });
}
function Navbar({ cursor, today, isCurrentMonth, habitCount, doneToday, onShiftMonth, onToday }) {
	const { user, isPro, signInWithGoogle, signOut } = useAuth();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const monthLabel = cursor.toLocaleString("en-US", { month: "long" });
	const yearLabel = cursor.getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center gap-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-bold tracking-tight text-foreground",
						children: "Habits Grid"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 sm:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onShiftMonth(-1),
							"aria-label": "Previous month",
							className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onToday,
							className: "rounded-md px-3 py-1 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
							children: [
								monthLabel,
								" ",
								yearLabel
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onShiftMonth(1),
							"aria-label": "Next month",
							className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						}),
						isCurrentMonth && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-1 font-mono text-[10px] text-muted-foreground",
							children: [
								doneToday,
								"/",
								habitCount
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 sm:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onShiftMonth(-1),
									"aria-label": "Previous month",
									className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: onToday,
									className: "rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
									children: [
										monthLabel.slice(0, 3),
										" ",
										yearLabel
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onShiftMonth(1),
									"aria-label": "Next month",
									className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSwitcher, {}),
						user && !isPro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigate({ to: "/onboarding" }),
							className: "rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
							children: "Upgrade"
						}),
						user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setMenuOpen(!menuOpen),
								className: "flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 transition-colors hover:bg-secondary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex size-5 items-center justify-center rounded-full bg-primary/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-medium text-primary",
											children: user.email.charAt(0).toUpperCase()
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										title: user.email,
										className: "hidden max-w-[120px] truncate font-mono text-[11px] text-muted-foreground md:block",
										children: user.email
									}),
									isPro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-primary px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary-foreground",
										children: "Pro"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary",
										children: "Free"
									})
								]
							}), menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fixed inset-0 z-40",
								onClick: () => setMenuOpen(false)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-md",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-b border-border px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs text-foreground",
											children: user.email
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 font-mono text-[10px] text-muted-foreground",
											children: isPro ? "Pro plan" : "Free plan"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/settings/billing",
										onClick: () => setMenuOpen(false),
										className: "block px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary",
										children: "Billing"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setMenuOpen(false);
											signOut().then(() => toast.success("Signed out — your habits are safely stored."));
										},
										className: "w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary",
										children: "Sign out"
									})
								]
							})] })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void signInWithGoogle(),
							disabled: !isSupabaseConfigured,
							title: isSupabaseConfigured ? void 0 : "Cloud sync is not configured",
							className: "flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								className: "size-3",
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
							}), "Sign in"]
						})
					]
				})
			]
		})
	});
}
var alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
	variants: { variant: {
		default: "bg-background text-foreground",
		destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
var Alert = import_react.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	role: "alert",
	className: cn(alertVariants({ variant }), className),
	...props
}));
Alert.displayName = "Alert";
var AlertTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
	ref,
	className: cn("mb-1 font-medium leading-none tracking-tight", className),
	...props
}));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm [&_p]:leading-relaxed", className),
	...props
}));
AlertDescription.displayName = "AlertDescription";
var STORAGE_KEY = "habit-tracker-v1";
var uid = () => Math.random().toString(36).slice(2, 9);
var makeHabit = (name, goal, color) => ({
	id: uid(),
	name,
	goal,
	color
});
var makeSection = (name) => ({
	id: uid(),
	name,
	habits: [],
	collapsed: false
});
var monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
var daysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
var cellKey = (month, day) => `${month}-${String(day).padStart(2, "0")}`;
var habitColorClass = {
	1: "bg-habit-1",
	2: "bg-habit-2",
	3: "bg-habit-3",
	4: "bg-habit-4",
	5: "bg-habit-5",
	6: "bg-habit-6"
};
var weekdayLabel = (year, monthIndex, day) => [
	"S",
	"M",
	"T",
	"W",
	"T",
	"F",
	"S"
][new Date(year, monthIndex, day).getDay()];
function InlineEdit({ value, onCommit, className, placeholder }) {
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(value);
	const inputRef = (0, import_react.useRef)(null);
	const mirrorRef = (0, import_react.useRef)(null);
	const [width, setWidth] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (editing && mirrorRef.current) {
			setWidth(mirrorRef.current.offsetWidth);
			inputRef.current?.focus();
		}
	}, [editing]);
	if (!editing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		onClick: () => {
			setDraft(value);
			setEditing(true);
		},
		className: `${className ?? ""} cursor-text`,
		children: value
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		ref: mirrorRef,
		className: `${className ?? ""} pointer-events-none absolute whitespace-pre opacity-0`,
		"aria-hidden": true,
		children: draft || placeholder || " "
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		ref: inputRef,
		value: draft,
		onChange: (e) => {
			setDraft(e.target.value);
			requestAnimationFrame(() => {
				if (mirrorRef.current) setWidth(mirrorRef.current.offsetWidth);
			});
		},
		onBlur: () => {
			onCommit(draft);
			setEditing(false);
		},
		onKeyDown: (e) => {
			if (e.key === "Enter") {
				onCommit(draft);
				setEditing(false);
			}
			if (e.key === "Escape") {
				setDraft(value);
				setEditing(false);
			}
		},
		placeholder,
		style: { width },
		className: `${className ?? ""} bg-transparent border-none outline-none p-0 m-0`
	})] });
}
function Index() {
	const today = (0, import_react.useMemo)(() => /* @__PURE__ */ new Date(), []);
	const { user, loading: authLoading, isPro } = useAuth();
	const [cursor, setCursor] = (0, import_react.useState)(() => new Date(today.getFullYear(), today.getMonth(), 1));
	const [state, setState] = (0, import_react.useState)({
		sections: [],
		completions: {}
	});
	const [adding, setAdding] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [upgradeOpen, setUpgradeOpen] = (0, import_react.useState)(false);
	const stateRef = (0, import_react.useRef)({
		sections: [],
		completions: {}
	});
	const cloudReadyRef = (0, import_react.useRef)(null);
	const lastSyncErrorRef = (0, import_react.useRef)(null);
	const gridRef = (0, import_react.useRef)(null);
	const [sharing, setSharing] = (0, import_react.useState)(false);
	const authResolved = !authLoading;
	const [demoMode, setDemoMode] = (0, import_react.useState)(false);
	const showOnboarding = authResolved && !isPro && !demoMode;
	(0, import_react.useEffect)(() => {
		if (authResolved && !user) setDemoMode(false);
	}, [authResolved, user]);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	(0, import_react.useEffect)(() => {
		if (!authResolved) return;
		if (!user) {
			setState({
				sections: [],
				completions: {}
			});
			cloudReadyRef.current = null;
			localStorage.removeItem(STORAGE_KEY);
			return;
		}
		if (!isPro) {
			cloudReadyRef.current = null;
			const local = (() => {
				try {
					const raw = localStorage.getItem(STORAGE_KEY);
					if (raw) {
						const parsed = JSON.parse(raw);
						if (parsed.sections?.length) return parsed;
					}
				} catch {}
				return null;
			})();
			if (local) setState(local);
			return;
		}
		const client = supabase;
		if (!client) return;
		const uid = user.id;
		let cancelled = false;
		cloudReadyRef.current = null;
		(async () => {
			try {
				const { data, error } = await client.from("user_state").select("data").eq("user_id", uid).maybeSingle();
				if (cancelled) return;
				if (error) throw error;
				const remote = data?.data ?? null;
				if (remote && Array.isArray(remote.sections)) setState({
					sections: remote.sections,
					completions: remote.completions ?? {}
				});
				else {
					const local = (() => {
						try {
							const raw = localStorage.getItem(STORAGE_KEY);
							if (raw) {
								const parsed = JSON.parse(raw);
								if (parsed.sections?.length) return parsed;
							}
						} catch {}
						return null;
					})();
					if (local) {
						setState(local);
						const seeded = await client.from("user_state").upsert({
							user_id: uid,
							data: local
						});
						if (seeded.error) throw seeded.error;
					}
				}
				cloudReadyRef.current = uid;
			} catch (err) {
				console.error(err);
				if (!cancelled) toast.error("Could not load your synced habits.");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		user,
		authResolved,
		isPro
	]);
	(0, import_react.useEffect)(() => {
		if (!authResolved || !user) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}, [
		state,
		authResolved,
		user
	]);
	(0, import_react.useEffect)(() => {
		stateRef.current = state;
	}, [state]);
	(0, import_react.useEffect)(() => {
		const client = supabase;
		if (!client || !user || !authResolved || !isPro) return;
		if (cloudReadyRef.current !== user.id) return;
		const t = setTimeout(() => {
			client.from("user_state").upsert({
				user_id: user.id,
				data: state
			}).then(({ error }) => {
				if (!error) {
					lastSyncErrorRef.current = null;
					return;
				}
				console.error("Cloud sync failed:", error.message);
				if (lastSyncErrorRef.current !== error.message) {
					lastSyncErrorRef.current = error.message;
					toast.error(`Cloud sync failed: ${error.message}`);
				}
			});
		}, 800);
		return () => clearTimeout(t);
	}, [
		state,
		user,
		authResolved,
		isPro
	]);
	const month = monthKey(cursor);
	const dayCount = daysInMonth(cursor);
	const days = (0, import_react.useMemo)(() => Array.from({ length: dayCount }, (_, i) => i + 1), [dayCount]);
	const isCurrentMonth = month === monthKey(today);
	const toggle = (0, import_react.useCallback)((habitId, day) => {
		const key = cellKey(month, day);
		setState((prev) => {
			const list = prev.completions[habitId] ?? [];
			const next = list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
			return {
				...prev,
				completions: {
					...prev.completions,
					[habitId]: next
				}
			};
		});
	}, [month]);
	const addHabit = (sectionId) => {
		const name = draft.trim();
		if (!name) return;
		setState((prev) => ({
			...prev,
			sections: prev.sections.map((s) => s.id === sectionId ? {
				...s,
				habits: [...s.habits, makeHabit(name, null, s.habits.length % 6 + 1)]
			} : s)
		}));
		setDraft("");
		setAdding(null);
	};
	const removeHabit = (sectionId, habitId) => {
		setState((prev) => ({
			...prev,
			sections: prev.sections.map((s) => s.id === sectionId ? {
				...s,
				habits: s.habits.filter((h) => h.id !== habitId)
			} : s)
		}));
	};
	const renameHabit = (sectionId, habitId, name) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		setState((prev) => ({
			...prev,
			sections: prev.sections.map((s) => s.id === sectionId ? {
				...s,
				habits: s.habits.map((h) => h.id === habitId ? {
					...h,
					name: trimmed
				} : h)
			} : s)
		}));
	};
	const recolorHabit = (sectionId, habitId, color) => {
		setState((prev) => ({
			...prev,
			sections: prev.sections.map((s) => s.id === sectionId ? {
				...s,
				habits: s.habits.map((h) => h.id === habitId ? {
					...h,
					color
				} : h)
			} : s)
		}));
	};
	const addSection = (name) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		setState((prev) => ({
			...prev,
			sections: [...prev.sections, makeSection(trimmed)]
		}));
	};
	const removeSection = (sectionId) => {
		setState((prev) => ({
			...prev,
			sections: prev.sections.filter((s) => s.id !== sectionId)
		}));
	};
	const renameSection = (sectionId, name) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		setState((prev) => ({
			...prev,
			sections: prev.sections.map((s) => s.id === sectionId ? {
				...s,
				name: trimmed
			} : s)
		}));
	};
	const toggleSection = (sectionId) => {
		setState((prev) => ({
			...prev,
			sections: prev.sections.map((s) => s.id === sectionId ? {
				...s,
				collapsed: !s.collapsed
			} : s)
		}));
	};
	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const activeId = active.id;
		const overId = over.id;
		const activeIsSection = state.sections.some((s) => s.id === activeId);
		const overIsSection = state.sections.some((s) => s.id === overId);
		if (activeIsSection && overIsSection) {
			setState((prev) => {
				const oldIndex = prev.sections.findIndex((s) => s.id === activeId);
				const newIndex = prev.sections.findIndex((s) => s.id === overId);
				return {
					...prev,
					sections: arrayMove(prev.sections, oldIndex, newIndex)
				};
			});
			return;
		}
		if (activeIsSection || overIsSection) return;
		const sourceSection = state.sections.find((s) => s.habits.some((h) => h.id === activeId));
		const destSection = state.sections.find((s) => s.habits.some((h) => h.id === overId));
		if (!sourceSection || !destSection) return;
		setState((prev) => {
			if (sourceSection.id === destSection.id) return {
				...prev,
				sections: prev.sections.map((s) => {
					if (s.id !== sourceSection.id) return s;
					const oldIndex = s.habits.findIndex((h) => h.id === activeId);
					const newIndex = s.habits.findIndex((h) => h.id === overId);
					return {
						...s,
						habits: arrayMove(s.habits, oldIndex, newIndex)
					};
				})
			};
			const source = prev.sections.find((s) => s.id === sourceSection.id);
			const dest = prev.sections.find((s) => s.id === destSection.id);
			const activeHabit = source.habits.find((h) => h.id === activeId);
			const overIndex = dest.habits.findIndex((h) => h.id === overId);
			return {
				...prev,
				sections: prev.sections.map((s) => {
					if (s.id === sourceSection.id) return {
						...s,
						habits: s.habits.filter((h) => h.id !== activeId)
					};
					if (s.id === destSection.id) {
						const newHabits = [...dest.habits];
						newHabits.splice(overIndex, 0, activeHabit);
						return {
							...s,
							habits: newHabits
						};
					}
					return s;
				})
			};
		});
	};
	const shiftMonth = (delta) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
	const handleShare = async () => {
		if (!gridRef.current || sharing) return;
		setSharing(true);
		try {
			const grid = gridRef.current;
			grid.classList.add("exporting");
			const wrapper = document.createElement("div");
			wrapper.style.cssText = `
        background: ${getComputedStyle(document.documentElement).getPropertyValue("--background").trim()};
        padding: 24px;
        border-radius: 12px;
        display: inline-block;
      `;
			const header = document.createElement("div");
			header.style.cssText = `
        font-family: 'Inter', system-ui, sans-serif;
        margin-bottom: 16px;
        color: ${getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim()};
      `;
			header.innerHTML = `
        <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">HabitsGrid</div>
        <div style="font-size: 13px; opacity: 0.6; margin-top: 2px;">${monthLabel} ${yearLabel}</div>
      `;
			wrapper.appendChild(header);
			const gridClone = grid.cloneNode(true);
			gridClone.classList.remove("exporting");
			gridClone.style.overflow = "visible";
			wrapper.appendChild(gridClone);
			document.body.appendChild(wrapper);
			const dataUrl = await toPng(wrapper, {
				pixelRatio: 2,
				cacheBust: true,
				backgroundColor: getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
			});
			document.body.removeChild(wrapper);
			grid.classList.remove("exporting");
			if (navigator.share && navigator.canShare) {
				const blob = await (await fetch(dataUrl)).blob();
				const file = new File([blob], `habitsgrid-${monthLabel.toLowerCase()}-${yearLabel}.png`, { type: "image/png" });
				if (navigator.canShare({ files: [file] })) {
					await navigator.share({
						title: `HabitsGrid — ${monthLabel} ${yearLabel}`,
						text: `My habit progress for ${monthLabel} ${yearLabel}`,
						files: [file]
					});
					toast.success("Shared successfully!");
					return;
				}
			}
			const link = document.createElement("a");
			link.download = `habitsgrid-${monthLabel.toLowerCase()}-${yearLabel}.png`;
			link.href = dataUrl;
			link.click();
			toast.success("Image downloaded!");
		} catch (err) {
			console.error("Share failed:", err);
			toast.error("Failed to export image.");
			gridRef.current?.classList.remove("exporting");
		} finally {
			setSharing(false);
		}
	};
	const allHabits = state.sections.flatMap((s) => s.habits);
	const doneToday = isCurrentMonth ? allHabits.filter((h) => (state.completions[h.id] ?? []).includes(cellKey(month, today.getDate()))).length : 0;
	const monthLabel = cursor.toLocaleString("en-US", { month: "long" });
	const yearLabel = cursor.getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background font-sans text-foreground",
		children: showOnboarding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingFlow, { onDemo: () => setDemoMode(true) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {
				cursor,
				today,
				isCurrentMonth,
				habitCount: allHabits.length,
				doneToday,
				onShiftMonth: shiftMonth,
				onToday: () => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-[1400px] px-4 py-8 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: [
								monthLabel,
								" ",
								yearLabel
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleShare,
							disabled: sharing || allHabits.length === 0,
							className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50",
							children: [sharing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3 animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-3" }), sharing ? "Exporting..." : "Share"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DndContext, {
						sensors,
						collisionDetection: closestCenter,
						onDragEnd: handleDragEnd,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: gridRef,
							id: "habit-grid",
							className: "overflow-x-auto rounded-lg border border-grid-line bg-surface shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table-fixed border-collapse text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-grid-line",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "sticky left-0 z-20 w-[240px] bg-secondary pl-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
										children: "Habit"
									}), days.map((d) => {
										const isToday = isCurrentMonth && d === today.getDate();
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
											className: `${isToday ? "w-[60px]" : "w-6"} border-l border-grid-line px-0 py-2 text-center font-mono text-[10px] font-medium ${isToday ? "bg-accent text-accent-foreground border-l-accent border-r-accent" : "text-muted-foreground"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block leading-tight",
												children: d
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[9px] opacity-50",
												children: weekdayLabel(cursor.getFullYear(), cursor.getMonth(), d)
											})]
										}, d);
									})]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
									items: state.sections.map((s) => s.id),
									strategy: verticalListSortingStrategy,
									children: state.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionRows, {
										section,
										days,
										month,
										today,
										isCurrentMonth,
										completions: state.completions,
										onToggle: toggle,
										onRemove: removeHabit,
										onRename: renameHabit,
										onRecolor: recolorHabit,
										onToggleSection: toggleSection,
										onRenameSection: renameSection,
										onRemoveSection: removeSection,
										adding: adding === section.id,
										draft,
										setDraft,
										onStartAdd: () => {
											setAdding(section.id);
											setDraft("");
										},
										onCancelAdd: () => setAdding(null),
										onCommitAdd: () => addHabit(section.id)
									}, section.id))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddGroupRow, { onAdd: addSection })] })]
							})
						})
					}),
					!isPro && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
						className: "mt-4 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: "Demo Mode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: "Your data is stored locally and will be lost when you close the browser or upgrade to a Pro account." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
						children: [user ? isPro ? "Drag to reorder · Click cells to tick · Synced to your account" : "Drag to reorder · Click cells to tick · " : "Drag to reorder · Click cells to tick · Sign in to sync", user && !isPro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setUpgradeOpen(true),
							className: "ml-1 text-primary transition-colors hover:underline",
							children: "Upgrade for cloud sync"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UpgradeDialog, {
				open: upgradeOpen,
				onOpenChange: setUpgradeOpen
			})
		] })
	});
}
function SectionRows({ section, days, month, today, isCurrentMonth, completions, onToggle, onRemove, onRename, onRecolor, onToggleSection, onRenameSection, onRemoveSection, adding, draft, setDraft, onStartAdd, onCancelAdd, onCommitAdd }) {
	const span = days.length + 1;
	const habitIds = section.habits.map((h) => h.id);
	const { attributes: sectionAttributes, listeners: sectionListeners, setNodeRef: setSectionNodeRef, transform: sectionTransform, transition: sectionTransition, isDragging: sectionDragging } = useSortable({ id: section.id });
	const sectionStyle = {
		transform: CSS.Transform.toString(sectionTransform),
		transition: sectionTransition,
		opacity: sectionDragging ? .4 : void 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			ref: setSectionNodeRef,
			style: sectionStyle,
			className: `border-y border-grid-line bg-secondary group/section ${sectionDragging ? "relative z-50" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "sticky left-0 z-10 w-[240px] bg-secondary pl-4 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							...sectionAttributes,
							...sectionListeners,
							className: "shrink-0 rounded p-0.5 text-muted-foreground/50 hover:text-foreground active:cursor-grabbing",
							"aria-label": `Drag group ${section.name}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onToggleSection(section.id),
							className: "shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground",
							"aria-label": section.collapsed ? `Expand ${section.name}` : `Collapse ${section.name}`,
							children: section.collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineEdit, {
							value: section.name,
							onCommit: (v) => onRenameSection(section.id, v),
							className: "flex-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-muted-foreground/60",
							children: section.habits.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": `Delete group ${section.name}`,
								className: "ml-1 rounded px-1 font-mono text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover/section:opacity-100",
								children: "×"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
							align: "start",
							side: "bottom",
							sideOffset: 4,
							className: "w-auto p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-foreground",
									children: [
										"Delete group \"",
										section.name,
										"\"?"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-[11px] text-muted-foreground",
									children: [
										section.habits.length,
										" habit",
										section.habits.length !== 1 ? "s" : "",
										" will be removed"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => onRemoveSection(section.id),
										className: "rounded bg-destructive px-2 py-0.5 text-[11px] font-medium text-destructive-foreground transition-colors hover:bg-destructive/90",
										children: "Delete"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverClose, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "rounded px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-secondary",
											children: "Cancel"
										})
									})]
								})
							]
						})] })
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				colSpan: span - 1,
				className: "bg-secondary"
			})]
		}),
		!section.collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
			items: habitIds,
			strategy: verticalListSortingStrategy,
			children: section.habits.map((habit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableHabitRow, {
				habit,
				sectionId: section.id,
				days,
				month,
				today,
				isCurrentMonth,
				completions,
				onToggle,
				onRemove,
				onRename,
				onRecolor
			}, habit.id))
		}),
		!section.collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "add-habit-row border-b border-grid-line",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "sticky left-0 z-10 bg-surface pl-4 py-1.5",
				children: adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					onBlur: onCommitAdd,
					onKeyDown: (e) => {
						if (e.key === "Enter") onCommitAdd();
						if (e.key === "Escape") onCancelAdd();
					},
					placeholder: "Habit name…",
					className: "bg-transparent border-none outline-none p-0 m-0 text-[13px] text-muted-foreground"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onStartAdd,
					className: "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground",
					children: "+ Add habit"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				colSpan: days.length,
				className: "bg-cell/30"
			})]
		})
	] });
}
function AddGroupRow({ onAdd }) {
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (adding) inputRef.current?.focus();
	}, [adding]);
	const commit = () => {
		onAdd(draft);
		setDraft("");
		setAdding(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "add-group-row border-t border-grid-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "sticky left-0 z-10 w-[240px] bg-surface pl-4 py-1.5",
			children: adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				onBlur: commit,
				onKeyDown: (e) => {
					if (e.key === "Enter") commit();
					if (e.key === "Escape") {
						setDraft("");
						setAdding(false);
					}
				},
				placeholder: "Group name…",
				className: "bg-transparent border-none outline-none p-0 m-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setAdding(true),
				className: "rounded border border-dashed border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground",
				children: "+ Add group"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			colSpan: 100,
			className: "bg-cell/30"
		})]
	});
}
function SortableHabitRow({ habit, sectionId, days, month, today, isCurrentMonth, completions, onToggle, onRemove, onRename, onRecolor }) {
	const [openColor, setOpenColor] = (0, import_react.useState)(false);
	const [colorPos, setColorPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const colorBtnRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!openColor) return;
		const close = (e) => {
			if (!e.target.closest("[data-color-picker]")) setOpenColor(false);
		};
		document.addEventListener("mousedown", close);
		return () => document.removeEventListener("mousedown", close);
	}, [openColor]);
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: habit.id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? .4 : void 0
	};
	const done = completions[habit.id] ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		ref: setNodeRef,
		style,
		className: `group border-b border-grid-line last:border-b-0 ${isDragging ? "relative z-50" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "sticky left-0 z-10 bg-surface pl-4 py-1.5 group-hover:bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						...attributes,
						...listeners,
						className: "shrink-0 rounded p-0.5 text-muted-foreground/50 hover:text-foreground active:cursor-grabbing",
						"aria-label": `Drag ${habit.name}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							ref: colorBtnRef,
							onClick: () => {
								if (!openColor && colorBtnRef.current) {
									const r = colorBtnRef.current.getBoundingClientRect();
									setColorPos({
										x: r.left,
										y: r.bottom + 4
									});
								}
								setOpenColor(!openColor);
							},
							className: `size-2 shrink-0 rounded-sm ${habitColorClass[habit.color]} cursor-pointer ring-1 ring-transparent transition-shadow hover:ring-foreground/30`,
							"aria-label": `Change color for ${habit.name}`
						}), openColor && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-color-picker": true,
							className: "fixed z-[9999] flex gap-1 rounded-md border border-border bg-popover p-1.5 shadow-md",
							style: {
								left: colorPos.x,
								top: colorPos.y
							},
							children: [
								1,
								2,
								3,
								4,
								5,
								6
							].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									onRecolor(sectionId, habit.id, c);
									setOpenColor(false);
								},
								className: `size-4 rounded-sm ${habitColorClass[c]} ${c === habit.color ? "ring-2 ring-foreground ring-offset-1 ring-offset-popover" : "hover:scale-125"} transition-transform`,
								"aria-label": `Color ${c}`
							}, c))
						}), document.body)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineEdit, {
						value: habit.name,
						onCommit: (v) => onRename(sectionId, habit.id, v),
						className: "truncate text-[13px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": `Delete ${habit.name}`,
							className: "ml-auto rounded px-1 font-mono text-xs text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100",
							children: "×"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
						align: "start",
						side: "right",
						sideOffset: 8,
						className: "w-auto p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-foreground",
							children: [
								"Delete \"",
								habit.name,
								"\"?"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onRemove(sectionId, habit.id),
								className: "rounded bg-destructive px-2 py-0.5 text-[11px] font-medium text-destructive-foreground transition-colors hover:bg-destructive/90",
								children: "Delete"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverClose, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "rounded px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-secondary",
									children: "Cancel"
								})
							})]
						})]
					})] })
				]
			})
		}), days.map((d) => {
			const key = cellKey(month, d);
			const filled = done.includes(key);
			const isToday = isCurrentMonth && d === today.getDate();
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: `border-l p-0 ${isToday ? "border-l-accent" : "border-grid-line"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onToggle(habit.id, d),
					"aria-label": `${habit.name} day ${d}`,
					"aria-pressed": filled,
					className: `block h-7 ${isToday ? "w-[60px]" : "w-8"} transition-colors ${filled ? `${habitColorClass[habit.color]} hover:opacity-80` : `${isToday ? "bg-accent/50" : "bg-cell/40"} hover:bg-accent`}`
				})
			}, d);
		})]
	});
}
//#endregion
export { Index as component };
