import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import ProfileForm from '../components/profile/ProfileForm';
import { useProfile } from '../hooks/useProfile';

const Profile: React.FC = () => {
  const { profile, loading, error, updateProfile, uploadAvatar } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          {error || 'Profile not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Profile
          </h1>
          <ProfileForm
            profile={profile}
            loading={loading}
            onUpdate={updateProfile}
            onAvatarUpload={uploadAvatar}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;