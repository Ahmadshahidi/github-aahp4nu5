/*
  # Create Stripe subscriptions table

  1. New Tables
    - `stripe_subscriptions`
      - `id` (uuid, primary key)
      - `customer_id` (text, references stripe_customers)
      - `subscription_id` (text, Stripe subscription ID)
      - `price_id` (text, Stripe price ID)
      - `current_period_start` (integer, Unix timestamp)
      - `current_period_end` (integer, Unix timestamp)
      - `cancel_at_period_end` (boolean)
      - `payment_method_brand` (text)
      - `payment_method_last4` (text)
      - `status` (text, subscription status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `stripe_subscriptions` table
    - Add policies for authenticated users to manage their own subscription data
*/

CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id text UNIQUE NOT NULL REFERENCES public.stripe_customers(customer_id) ON DELETE CASCADE,
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

ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own subscription data" ON public.stripe_subscriptions
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.stripe_customers WHERE customer_id = stripe_subscriptions.customer_id));

CREATE POLICY "Allow authenticated users to update their own subscription data" ON public.stripe_subscriptions
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.stripe_customers WHERE customer_id = stripe_subscriptions.customer_id));

CREATE POLICY "Allow authenticated users to insert their own subscription data" ON public.stripe_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.stripe_customers WHERE customer_id = stripe_subscriptions.customer_id));