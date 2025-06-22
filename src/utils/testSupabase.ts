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
    // Note: This will only work if the user has admin privileges
    // In most cases, buckets should be created via migrations
    const { data, error } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    });
    
    if (error) {
      console.error('❌ Failed to create bucket:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Bucket created successfully:', data);
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Bucket creation failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const runAvatarsBucketMigration = async () => {
  console.log('🔧 Running avatars bucket migration manually...');
  
  try {
    // Execute the migration SQL directly
    const migrationSQL = `
      -- Create the avatars bucket if it doesn't exist
      DO $$
      BEGIN
        -- Check if bucket exists
        IF NOT EXISTS (
          SELECT 1 FROM storage.buckets WHERE id = 'avatars'
        ) THEN
          -- Create the bucket
          INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
          VALUES (
            'avatars',
            'avatars', 
            true,
            5242880,
            ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
          );
        ELSE
          -- Update existing bucket configuration
          UPDATE storage.buckets
          SET 
            public = true,
            file_size_limit = 5242880,
            allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
          WHERE id = 'avatars';
        END IF;
      END $$;
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      return { 
        success: false, 
        error: `Migration failed: ${error.message}. This requires database admin privileges.` 
      };
    }
    
    console.log('✅ Migration executed successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Migration execution failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? 
        `Migration failed: ${error.message}. This requires database admin privileges.` : 
        'Unknown migration error' 
    };
  }
};