import React from 'react';
import { Profile } from '../../models/profile';
import Button from '../ui/Button';
import AvatarUpload from './AvatarUpload';

interface ProfileFormProps {
  profile: Profile;
  loading: boolean;
  onUpdate: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  onAvatarUpload: (file: File) => Promise<{ publicUrl: string | null; error: string | null }>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  loading,
  onUpdate,
  onAvatarUpload
}) => {
  const [formData, setFormData] = React.useState({
    full_name: profile.full_name || '',
    highest_education: profile.highest_education || '',
    company: profile.company || '',
    experience_years: profile.experience_years || '',
    job_title: profile.job_title || '',
    is_public: profile.is_public
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting profile update:', formData);
    const result = await onUpdate(formData);
    if (result.error) {
      console.error('Profile update error:', result.error);
      alert(result.error);
    } else {
      console.log('Profile updated successfully');
      alert('Profile updated successfully');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvatarUpload
        currentAvatarUrl={profile.avatar_url}
        onUpload={onAvatarUpload}
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Highest Education
          </label>
          <input
            type="text"
            name="highest_education"
            value={formData.highest_education}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Years of Experience
          </label>
          <input
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Title
          </label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_public"
            checked={formData.is_public}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Make profile public
          </label>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  );
};

export default ProfileForm