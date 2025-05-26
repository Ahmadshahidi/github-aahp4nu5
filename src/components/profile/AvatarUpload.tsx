import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import Button from '../ui/Button';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onUpload: (file: File) => Promise<{ publicUrl: string | null; error: string | null }>;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatarUrl, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const result = await onUpload(file);
      if (result.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32">
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Change Avatar'}
      </Button>
    </div>
  );
};

export default AvatarUpload