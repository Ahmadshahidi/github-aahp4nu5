/*
  # Fix Stripe subscription access issues

  1. Ensure all Stripe tables exist with proper structure
  2. Recreate the stripe_user_subscriptions view with proper permissions
  3. Fix RLS policies to allow proper access
  4. Grant necessary permissions to authenticated users

  2. Security
    - Enable RLS on all Stripe tables
    - Create policies for user access to their own data
    - Ensure views have proper security context
*/

-- Ensure stripe_customers table exists with correct structure
CREATE TABLE IF NOT EXISTS public.stripe_customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id text UNIQUE NOT NULL,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Ensure stripe_subscriptions table exists with correct structure
CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id text UNIQUE NOT NULL,
    subscription_id text,
    price_id text,
    current_period_start integer,
    current_period_end integer,
    cancel_at_period_end boolean DEFAULT false,
    payment_method_brand text,
    payment_method_last4 text,
    status text DEFAULT 'not_started',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Ensure stripe_orders table exists with correct structure
CREATE TABLE IF NOT EXISTS public.stripe_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_session_id text UNIQUE NOT NULL,
    payment_intent_id text,
    customer_id text NOT NULL,
    amount_subtotal integer,
    amount_total integer,
    currency text DEFAULT 'usd',
    payment_status text DEFAULT 'pending',
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own customer data" ON public.stripe_customers;
DROP POLICY IF EXISTS "Users can insert their own customer data" ON public.stripe_customers;
DROP POLICY IF EXISTS "Users can update their own customer data" ON public.stripe_customers;

DROP POLICY IF EXISTS "Users can view their own subscription data" ON public.stripe_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription data" ON public.stripe_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription data" ON public.stripe_subscriptions;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.stripe_orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.stripe_orders;

-- Create RLS policies for stripe_customers
CREATE POLICY "Users can view their own customer data"
ON public.stripe_customers FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert their own customer data"
ON public.stripe_customers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer data"
ON public.stripe_customers FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for stripe_subscriptions
CREATE POLICY "Users can view their own subscription data"
ON public.stripe_subscriptions FOR SELECT
TO authenticated
USING (
    customer_id IN (
        SELECT customer_id FROM public.stripe_customers 
        WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can insert their own subscription data"
ON public.stripe_subscriptions FOR INSERT
TO authenticated
WITH CHECK (
    customer_id IN (
        SELECT customer_id FROM public.stripe_customers 
        WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can update their own subscription data"
ON public.stripe_subscriptions FOR UPDATE
TO authenticated
USING (
    customer_id IN (
        SELECT customer_id FROM public.stripe_customers 
        WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
)
WITH CHECK (
    customer_id IN (
        SELECT customer_id FROM public.stripe_customers 
        WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
);

-- Create RLS policies for stripe_orders
CREATE POLICY "Users can view their own orders"
ON public.stripe_orders FOR SELECT
TO authenticated
USING (
    customer_id IN (
        SELECT customer_id FROM public.stripe_customers 
        WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
);

CREATE POLICY "Users can insert their own orders"
ON public.stripe_orders FOR INSERT
TO authenticated
WITH CHECK (
    customer_id IN (
        SELECT customer_id FROM public.stripe_customers 
        WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
);

-- Drop existing views if they exist
DROP VIEW IF EXISTS public.stripe_user_subscriptions CASCADE;
DROP VIEW IF EXISTS public.stripe_user_orders CASCADE;

-- Create the stripe_user_subscriptions view that the application expects
-- Using security_definer to ensure proper access
CREATE VIEW public.stripe_user_subscriptions AS
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

-- Create the stripe_user_orders view
CREATE VIEW public.stripe_user_orders AS
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
GRANT SELECT ON public.stripe_user_subscriptions TO authenticated;
GRANT SELECT ON public.stripe_user_orders TO authenticated;

-- Grant access to the underlying tables for authenticated users
GRANT SELECT ON public.stripe_customers TO authenticated;
GRANT SELECT ON public.stripe_subscriptions TO authenticated;
GRANT SELECT ON public.stripe_orders TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON public.stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_customer_id ON public.stripe_customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id ON public.stripe_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id ON public.stripe_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_checkout_session_id ON public.stripe_orders(checkout_session_id);

-- Add foreign key constraints if they don't exist
DO $$
BEGIN
    -- Add foreign key for stripe_subscriptions
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'stripe_subscriptions_customer_id_fkey'
        AND table_name = 'stripe_subscriptions'
    ) THEN
        ALTER TABLE public.stripe_subscriptions 
        ADD CONSTRAINT stripe_subscriptions_customer_id_fkey 
        FOREIGN KEY (customer_id) REFERENCES public.stripe_customers(customer_id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for stripe_orders
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'stripe_orders_customer_id_fkey'
        AND table_name = 'stripe_orders'
    ) THEN
        ALTER TABLE public.stripe_orders 
        ADD CONSTRAINT stripe_orders_customer_id_fkey 
        FOREIGN KEY (customer_id) REFERENCES public.stripe_customers(customer_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create a function to get user subscription data (alternative approach)
CREATE OR REPLACE FUNCTION public.get_user_subscription()
RETURNS TABLE (
    customer_id text,
    subscription_id text,
    subscription_status text,
    price_id text,
    current_period_start integer,
    current_period_end integer,
    cancel_at_period_end boolean,
    payment_method_brand text,
    payment_method_last4 text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        sc.customer_id,
        ss.subscription_id,
        ss.status,
        ss.price_id,
        ss.current_period_start,
        ss.current_period_end,
        ss.cancel_at_period_end,
        ss.payment_method_brand,
        ss.payment_method_last4
    FROM public.stripe_customers sc
    LEFT JOIN public.stripe_subscriptions ss ON sc.customer_id = ss.customer_id
    WHERE sc.user_id = auth.uid()
    AND sc.deleted_at IS NULL;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_subscription() TO authenticated;