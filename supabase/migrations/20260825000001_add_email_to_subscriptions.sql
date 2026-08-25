-- Add email column to subscriptions table
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS email TEXT;
-- Add 'pending' to status check
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'cancelled', 'expired', 'inactive', 'pending'));
