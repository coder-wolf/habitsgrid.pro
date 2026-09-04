import { r as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-ocTNi26f.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Cwrqn4MW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
var toAuthUser = (user) => user ? {
	id: user.id,
	email: user.email ?? ""
} : null;
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(Boolean(supabase));
	const [subscription, setSubscription] = (0, import_react.useState)(null);
	const [subLoading, setSubLoading] = (0, import_react.useState)(false);
	const fetchedForUserRef = (0, import_react.useRef)(null);
	const fetchSubscription = (0, import_react.useCallback)(async (userId) => {
		if (!supabase) return;
		setSubLoading(true);
		try {
			console.log("[Auth] Fetching subscription for user:", userId);
			const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
			if (error) console.error("[Auth] Subscription fetch error:", error.message, error.code);
			else console.log("[Auth] Subscription result:", data);
			setSubscription(data ?? null);
		} catch (e) {
			console.error("[Auth] Subscription fetch exception:", e);
			setSubscription(null);
		} finally {
			setSubLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!supabase) return;
		let cancelled = false;
		supabase.auth.getSession().then(({ data }) => {
			if (!cancelled) {
				const u = toAuthUser(data.session?.user ?? null);
				setUser(u);
				setLoading(false);
				if (u) {
					fetchedForUserRef.current = u.id;
					fetchSubscription(u.id);
				}
			}
		});
		const { data } = supabase.auth.onAuthStateChange((_event, session) => {
			const u = toAuthUser(session?.user ?? null);
			setUser(u);
			if (u && u.id !== fetchedForUserRef.current) {
				fetchedForUserRef.current = u.id;
				fetchSubscription(u.id);
			} else if (!u) {
				setSubscription(null);
				fetchedForUserRef.current = null;
			}
		});
		return () => {
			cancelled = true;
			data.subscription.unsubscribe();
		};
	}, [fetchSubscription]);
	const isPro = subscription?.status === "active";
	const value = (0, import_react.useMemo)(() => ({
		user,
		loading: loading || subLoading,
		subscription,
		isPro,
		signInWithGoogle: async () => {
			if (!supabase) return "Cloud sync is not configured.";
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: window.location.origin }
			});
			return error ? error.message : null;
		},
		signOut: async () => {
			setSubscription(null);
			fetchedForUserRef.current = null;
			await supabase?.auth.signOut();
		},
		refresh: async () => {
			if (user) await fetchSubscription(user.id);
		}
	}), [
		user,
		loading,
		subLoading,
		subscription,
		isPro,
		fetchSubscription
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };
