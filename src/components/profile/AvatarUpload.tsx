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
    // Prevent any form submission
    event.preventDefault();
    event.stopPropagation();
    
    try {
      setUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) {
        setUploading(false);
        return;
      }

      console.log('Starting avatar upload for file:', file.name);

      const result = await onUpload(file);
      if (result.error) {
        throw new Error(result.error);
      } else {
        console.log('Avatar upload successful, new URL:', result.publicUrl);
        alert('Avatar updated successfully!');
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert(error instanceof Error ? error.message : 'Error uploading avatar');
      // Reset the file input on error too
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
            key={currentAvatarUrl} // Force re-render when URL changes
            onError={(e) => {
              console.error('Failed to load avatar image:', currentAvatarUrl);
              // Fallback to placeholder on error
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {currentAvatarUrl && (
          <div className="absolute inset-0 w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
               style={{ display: 'none' }}
               id="avatar-fallback">
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
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Change Avatar'}
      </Button>
      {currentAvatarUrl && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs break-all">
          Current: {currentAvatarUrl.split('/').pop()?.split('?')[0]}
        </p>
      )}
    </div>
  );
};

export default AvatarUpload