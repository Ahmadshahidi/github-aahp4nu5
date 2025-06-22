import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Check if we can connect to Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('✅ Session check:', session ? 'Authenticated' : 'Not authenticated', sessionError);
    
    // Test 2: Check storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    console.log('📦 Available buckets:', buckets?.map(b => b.name), bucketsError);
    
    // Test 3: Check if avatars bucket exists
    const avatarsBucket = buckets?.find(b => b.name === 'avatars');
    console.log('🖼️ Avatars bucket:', avatarsBucket ? 'Found' : 'Not found');
    
    // Test 4: Check profiles table access
    if (session?.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      console.log('👤 Profile access:', profile ? 'Success' : 'Failed', profileError);
    }
    
    return {
      connected: true,
      session: !!session,
      bucketsAvailable: !!buckets,
      avatarsBucket: !!avatarsBucket,
      error: null
    };
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return {
      connected: false,
      session: false,
      bucketsAvailable: false,
      avatarsBucket: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};