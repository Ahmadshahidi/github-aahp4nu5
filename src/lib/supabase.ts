import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase config:', { url: supabaseUrl, hasKey: !!supabaseAnonKey });

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test connection
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
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
};

export type Profile = Tables['profiles']['Row'];
export type ContentItem = Tables['content_items']['Row'];