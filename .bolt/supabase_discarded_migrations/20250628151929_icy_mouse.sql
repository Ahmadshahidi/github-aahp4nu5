/*
  # Create Stripe customers table

  1. New Tables
    - `stripe_customers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `customer_id` (text, Stripe customer ID)
      - `deleted_at` (timestamp, for soft deletes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `stripe_customers` table
    - Add policies for authenticated users to manage their own customer data
*/

CREATE TABLE IF NOT EXISTS public.stripe_customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id text UNIQUE NOT NULL,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own customer data" ON public.stripe_customers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their own customer data" ON public.stripe_customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own customer data" ON public.stripe_customers
  FOR UPDATE USING (auth.uid() = user_id);