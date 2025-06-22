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
    let profileAccess = false;
    if (session?.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      console.log('👤 Profile access:', profile ? 'Success' : 'Failed', profileError);
      profileAccess = !!profile;
    }
    
    // Test 5: Test storage permissions if bucket exists
    let storagePermissions = null;
    if (avatarsBucket && session?.user) {
      try {
        // Try to list files in user's folder
        const { data: files, error: listError } = await supabase.storage
          .from('avatars')
          .list(session.user.id);
        
        storagePermissions = {
          canList: !listError,
          listError: listError?.message
        };
        console.log('📁 Storage permissions:', storagePermissions);
      } catch (err) {
        storagePermissions = {
          canList: false,
          listError: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }
    return {
      connected: true,
      session: !!session,
      userId: session?.user?.id,
      bucketsAvailable: !!buckets,
      avatars: !!avatarsBucket,
      profileAccess,
      storagePermissions,
      bucketsList: buckets?.map(b => ({ name: b.name, public: b.public })),
      error: null
    };
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return {
      connected: false,
      session: false,
      userId: null,
      bucketsAvailable: false,
      avatars: false,
      profileAccess: false,
      storagePermissions: null,
      bucketsList: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
export const createAvatarsBucket = async () => {
  console.log('🔧 Attempting to create avatars bucket...');
  
  try {
    // First, check if bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const existingBucket = buckets?.find(b => b.name === 'avatars');
    
    if (existingBucket) {
      console.log('✅ Avatars bucket already exists');
      return { success: true, error: null };
    }

    // Try to create the bucket
    const { data, error } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    });
    
    if (error) {
      console.error('❌ Failed to create bucket:', error);
      return { 
        success: false, 
        error: `${error.message}. Note: Bucket creation typically requires admin privileges or should be done via migrations.` 
      };
    }
    
    console.log('✅ Bucket created successfully:', data);
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Bucket creation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? 
        `${error.message}. Bucket creation usually requires admin privileges.` : 
        'Unknown error' 
    };
  }
};