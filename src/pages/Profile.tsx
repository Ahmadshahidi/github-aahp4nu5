import React from 'react';
import { useState } from 'react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProfileForm from '../components/profile/ProfileForm';
import AvatarUpload from '../components/profile/AvatarUpload';
import MyCourses from '../components/profile/MyCourses';
import { useProfile } from '../hooks/useProfile';
import { BookOpen, User } from 'lucide-react';

const Profile: React.FC = () => {
  const { profile, loading, error, updateProfile, uploadAvatar } = useProfile();
  const [activeTab, setActiveTab] = useState<'profile' | 'courses'>('profile');

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
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'courses'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            My Courses
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {activeTab === 'profile' ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Edit Profile
              </h1>
              
              {/* Avatar Upload Section - Separate from form */}
              <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Profile Picture
                </h2>
                <AvatarUpload
                  currentAvatarUrl={profile.avatar_url}
                  onUpload={uploadAvatar}
                />
              </div>

              {/* Profile Information Form */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Profile Information
                </h2>
                <ProfileForm
                  profile={profile}
                  loading={loading}
                  onUpdate={updateProfile}
                />
              </div>
            </>
          ) : (
            <MyCourses />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;