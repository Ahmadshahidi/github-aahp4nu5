import React, { useEffect, useState } from 'react';
import { User, TestTube } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import ProfileForm from '../components/profile/ProfileForm';
import { useProfile } from '../hooks/useProfile';
import { testSupabaseConnection, createAvatarsBucket } from '../utils/testSupabase';
import Button from '../components/ui/Button';

const Profile: React.FC = () => {
  const { profile, loading, error, updateProfile, uploadAvatar } = useProfile();
  const [testResults, setTestResults] = useState<any>(null);
  const [creatingBucket, setCreatingBucket] = useState(false);

  const runConnectionTest = async () => {
    console.log('Running Supabase connection test...');
    const results = await testSupabaseConnection();
    setTestResults(results);
  };

  const handleCreateBucket = async () => {
    setCreatingBucket(true);
    const result = await createAvatarsBucket();
    if (result.success) {
      alert('Bucket created successfully! Run the connection test again to verify.');
      // Re-run the test
      await runConnectionTest();
    } else {
      alert(`Failed to create bucket: ${result.error}`);
    }
    setCreatingBucket(false);
  };

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
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Debug Tools
            </h2>
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={runConnectionTest}
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              {testResults && !testResults.avatars && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCreateBucket}
                    disabled={creatingBucket}
                  >
                    {creatingBucket ? 'Creating...' : 'Create Bucket'}
                  </Button>
                </>
              )}
            </div>
            {testResults && (
              <div className="mt-4 text-sm">
               <div className="mb-2">
                 <strong>Status:</strong> {testResults.avatars ? '✅ Ready for uploads' : '❌ Avatars bucket missing - contact admin to run migrations'}
               </div>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> If the avatars bucket is missing, the database migrations need to be run by an administrator. 
              The "Create Bucket\" button will only work if you have admin privileges.
            </div>
          </div>
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