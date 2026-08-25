import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Subscription, SubscriptionContextValue } from "@/lib/subscription";

export type AuthUser = { id: string; email: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
} & SubscriptionContextValue;

const AuthContext = createContext<AuthContextValue | null>(null);

const toAuthUser = (user: User | null): AuthUser | null =>
  user ? { id: user.id, email: user.email ?? "" } : null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const fetchedForUserRef = useRef<string | null>(null);

  const fetchSubscription = useCallback(async (userId: string) => {
    if (!supabase) return;
    setSubLoading(true);
    try {
      console.log("[Auth] Fetching subscription for user:", userId);
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) {
        console.error("[Auth] Subscription fetch error:", error.message, error.code);
      } else {
        console.log("[Auth] Subscription result:", data);
      }
      setSubscription((data as Subscription | null) ?? null);
    } catch (e) {
      console.error("[Auth] Subscription fetch exception:", e);
      setSubscription(null);
    } finally {
      setSubLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        const u = toAuthUser(data.session?.user ?? null);
        setUser(u);
        setLoading(false);
        if (u) {
          fetchedForUserRef.current = u.id;
          void fetchSubscription(u.id);
        }
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = toAuthUser(session?.user ?? null);
      setUser(u);
      if (u && u.id !== fetchedForUserRef.current) {
        fetchedForUserRef.current = u.id;
        void fetchSubscription(u.id);
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

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: loading || subLoading,
      subscription,
      isPro,
      signInWithGoogle: async () => {
        if (!supabase) return "Cloud sync is not configured.";
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin },
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
      },
    }),
    [user, loading, subLoading, subscription, isPro, fetchSubscription],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
