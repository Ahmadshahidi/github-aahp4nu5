import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../models/profile';
import { useAuth } from '../contexts/AuthContext';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user!.id);

      if (error) throw error;
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to update profile' };
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Check if user session is valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Authentication session expired. Please sign in again.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Add cache-busting parameter to ensure fresh image load
      const cacheBustedUrl = `${publicUrl}?t=${Date.now()}`;

      const updateResult = await updateProfile({ avatar_url: cacheBustedUrl });
      if (updateResult.error) {
        throw new Error(updateResult.error);
      }

      // Force refresh the profile data to ensure UI updates
      await fetchProfile();
      
      return { publicUrl: cacheBustedUrl, error: null };
    } catch (err) {
      return { publicUrl: null, error: err instanceof Error ? err.message : 'Failed to upload avatar' };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refreshProfile: fetchProfile
  };
};