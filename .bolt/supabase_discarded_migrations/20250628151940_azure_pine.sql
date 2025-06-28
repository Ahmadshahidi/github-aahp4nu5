/*
  # Create Stripe orders table

  1. New Tables
    - `stripe_orders`
      - `id` (uuid, primary key)
      - `checkout_session_id` (text, Stripe checkout session ID)
      - `payment_intent_id` (text, Stripe payment intent ID)
      - `customer_id` (text, references stripe_customers)
      - `amount_subtotal` (integer, amount in cents)
      - `amount_total` (integer, amount in cents)
      - `currency` (text, currency code)
      - `payment_status` (text, payment status)
      - `status` (text, order status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `stripe_orders` table
    - Add policies for authenticated users to view their own orders
*/

CREATE TABLE IF NOT EXISTS public.stripe_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_session_id text UNIQUE NOT NULL,
    payment_intent_id text,
    customer_id text NOT NULL REFERENCES public.stripe_customers(customer_id) ON DELETE CASCADE,
    amount_subtotal integer,
    amount_total integer,
    currency text DEFAULT 'usd',
    payment_status text DEFAULT 'pending',
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own orders" ON public.stripe_orders
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.stripe_customers WHERE customer_id = stripe_orders.customer_id));

CREATE POLICY "Allow authenticated users to insert their own orders" ON public.stripe_orders
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.stripe_customers WHERE customer_id = stripe_orders.customer_id));