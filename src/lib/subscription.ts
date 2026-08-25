export type SubscriptionStatus = "active" | "cancelled" | "expired" | "inactive";

export type Subscription = {
  id: string;
  user_id: string;
  lemon_squeezy_id: string;
  status: SubscriptionStatus;
  plan_id: string;
  variant_id: string;
  renews_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SubscriptionContextValue = {
  subscription: Subscription | null;
  isPro: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
};
