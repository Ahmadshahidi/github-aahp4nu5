import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper functions for type-safe database access
export type Tables = {
  profiles: {
    Row: {
      id: string;
      username: string;
      email: string;
      is_admin: boolean;
      created_at: string;
      updated_at: string;
    };
  };
  content_items: {
    Row: {
      id: string;
      title: string;
      content: string;
      category: 'course' | 'notebook' | 'blog';
      status: 'draft' | 'published';
      author_id: string;
      created_at: string;
      updated_at: string;
      published_at: string | null;
      last_edited_at: string;
    };
  };
  stripe_subscriptions: {
    Row: {
      customer_id: string | null;
      subscription_id: string | null;
      subscription_status: string | null;
      price_id: string | null;
      current_period_start: number | null;
      current_period_end: number | null;
      cancel_at_period_end: boolean;
      payment_method_brand: string | null;
      payment_method_last4: string | null;
    };
  };
};

export type Profile = Tables['profiles']['Row'];
export type ContentItem = Tables['content_items']['Row'];
export type StripeSubscription = Tables['stripe_subscriptions']['Row'];