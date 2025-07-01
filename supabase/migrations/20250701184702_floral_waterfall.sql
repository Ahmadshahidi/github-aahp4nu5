/*
  # Create Stripe Integration Tables

  1. New Tables
    - `stripe_customers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `customer_id` (text, unique, Stripe customer ID)
      - `created_at` (timestamp)
      - `deleted_at` (timestamp, for soft deletes)
    
    - `stripe_subscriptions`
      - `id` (uuid, primary key)
      - `customer_id` (text, references stripe_customers)
      - `subscription_id` (text, unique, Stripe subscription ID)
      - `subscription_status` (text, Stripe subscription status)
      - `price_id` (text, Stripe price ID)
      - `current_period_start` (bigint, Unix timestamp)
      - `current_period_end` (bigint, Unix timestamp)
      - `cancel_at_period_end` (boolean)
      - `payment_method_brand` (text, card brand)
      - `payment_method_last4` (text, last 4 digits)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `stripe_orders`
      - `id` (uuid, primary key)
      - `checkout_session_id` (text, unique, Stripe session ID)
      - `payment_intent_id` (text, unique, Stripe payment intent ID)
      - `customer_id` (text, references stripe_customers)
      - `amount_subtotal` (bigint, amount in cents)
      - `amount_total` (bigint, amount in cents)
      - `currency` (text, currency code)
      - `payment_status` (text, payment status)
      - `status` (text, order status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to access their own data only
    - Add policies for service role to manage all data

  3. Indexes
    - Add indexes for frequently queried columns
    - Add unique constraints where needed
*/

-- Create stripe_customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.stripe_customers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    deleted_at timestamptz
);

-- Create stripe_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id text NOT NULL REFERENCES public.stripe_customers(customer_id) ON DELETE CASCADE,
    subscription_id text UNIQUE,
    subscription_status text,
    price_id text,
    current_period_start bigint,
    current_period_end bigint,
    cancel_at_period_end boolean DEFAULT false,
    payment_method_brand text,
    payment_method_last4 text,
    status text, -- Additional status field used by webhook
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create stripe_orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.stripe_orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    checkout_session_id text UNIQUE NOT NULL,
    payment_intent_id text UNIQUE,
    customer_id text NOT NULL REFERENCES public.stripe_customers(customer_id) ON DELETE CASCADE,
    amount_subtotal bigint,
    amount_total bigint,
    currency text,
    payment_status text,
    status text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_orders ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS stripe_customers_user_id_idx ON public.stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS stripe_customers_customer_id_idx ON public.stripe_customers(customer_id);
CREATE INDEX IF NOT EXISTS stripe_subscriptions_customer_id_idx ON public.stripe_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS stripe_subscriptions_subscription_id_idx ON public.stripe_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS stripe_orders_customer_id_idx ON public.stripe_orders(customer_id);
CREATE INDEX IF NOT EXISTS stripe_orders_checkout_session_id_idx ON public.stripe_orders(checkout_session_id);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own customer data" ON public.stripe_customers;
DROP POLICY IF EXISTS "Service role can manage all customer data" ON public.stripe_customers;
DROP POLICY IF EXISTS "Users can view their own subscription data" ON public.stripe_subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscription data" ON public.stripe_subscriptions;
DROP POLICY IF EXISTS "Users can view their own order data" ON public.stripe_orders;
DROP POLICY IF EXISTS "Service role can manage all order data" ON public.stripe_orders;

-- RLS Policies for stripe_customers
CREATE POLICY "Users can view their own customer data"
    ON public.stripe_customers
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all customer data"
    ON public.stripe_customers
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- RLS Policies for stripe_subscriptions
CREATE POLICY "Users can view their own subscription data"
    ON public.stripe_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id 
            FROM public.stripe_customers 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all subscription data"
    ON public.stripe_subscriptions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- RLS Policies for stripe_orders
CREATE POLICY "Users can view their own order data"
    ON public.stripe_orders
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id 
            FROM public.stripe_customers 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all order data"
    ON public.stripe_orders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create a unique constraint on customer_id for stripe_subscriptions to ensure one subscription per customer if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'stripe_subscriptions' AND constraint_name = 'stripe_subscriptions_customer_id_unique'
  ) THEN
    CREATE UNIQUE INDEX stripe_subscriptions_customer_id_unique 
        ON public.stripe_subscriptions(customer_id);
  END IF;
END $$;