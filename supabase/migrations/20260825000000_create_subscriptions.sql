-- Create subscriptions table for LemonSqueezy integration
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lemon_squeezy_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'cancelled', 'expired', 'inactive')),
  plan_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  renews_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique constraint: one subscription per user
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);

-- Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role (webhooks) can insert/update
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
 