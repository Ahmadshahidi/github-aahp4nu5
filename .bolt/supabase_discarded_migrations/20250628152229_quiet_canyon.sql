/*
  # Create Stripe Views and Fix Table Structure

  1. Views
    - `stripe_user_subscriptions` - User-friendly view for subscription data
    - `stripe_user_orders` - User-friendly view for order data

  2. Fixes
    - Ensure proper column names match what the application expects
    - Add any missing indexes for performance
*/

-- Create view for user subscriptions (this is what the application is looking for)
CREATE OR REPLACE VIEW public.stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    sc.customer_id,
    ss.subscription_id,
    ss.status as subscription_status,
    ss.price_id,
    ss.current_period_start,
    ss.current_period_end,
    ss.cancel_at_period_end,
    ss.payment_method_brand,
    ss.payment_method_last4,
    ss.created_at,
    ss.updated_at
FROM public.stripe_customers sc
LEFT JOIN public.stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE sc.user_id = auth.uid()
AND sc.deleted_at IS NULL;

-- Grant access to authenticated users
GRANT SELECT ON public.stripe_user_subscriptions TO authenticated;

-- Create view for user orders
CREATE OR REPLACE VIEW public.stripe_user_orders WITH (security_invoker = true) AS
SELECT
    sc.customer_id,
    so.id as order_id,
    so.checkout_session_id,
    so.payment_intent_id,
    so.amount_subtotal,
    so.amount_total,
    so.currency,
    so.payment_status,
    so.status as order_status,
    so.created_at as order_date
FROM public.stripe_customers sc
LEFT JOIN public.stripe_orders so ON sc.customer_id = so.customer_id
WHERE sc.user_id = auth.uid()
AND sc.deleted_at IS NULL;

-- Grant access to authenticated users
GRANT SELECT ON public.stripe_user_orders TO authenticated;

-- Add indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON public.stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_customer_id ON public.stripe_customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id ON public.stripe_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id ON public.stripe_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_checkout_session_id ON public.stripe_orders(checkout_session_id);