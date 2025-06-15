
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from 'lucide-react';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { ALLOWED_IMAGE_TYPES, ALLOWED_EXTENSIONS } from '@/constants/avatarConstants';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onAvatarUpdate: (url: string) => void;
  userInitials: string;
}

export const AvatarUpload = ({ currentAvatarUrl, onAvatarUpdate, userInitials }: AvatarUploadProps) => {
  const { uploading, uploadAvatar } = useAvatarUpload({ onAvatarUpdate });

  const handleButtonClick = () => {
    console.log('Avatar upload button clicked');
    document.getElementById('avatar-upload')?.click();
  };

  const handleAvatarClick = () => {
    console.log('Avatar clicked');
    document.getElementById('avatar-upload')?.click();
  };

  // Créer la liste des types acceptés pour l'attribut accept
  const acceptTypes = ALLOWED_IMAGE_TYPES.join(',');

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>
          <AvatarImage src={currentAvatarUrl || undefined} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          variant="secondary"
          className="absolute -bottom-2 -right-2 rounded-full"
          disabled={uploading}
          onClick={handleAvatarClick}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <input
        id="avatar-upload"
        type="file"
        accept={acceptTypes}
        onChange={uploadAvatar}
        disabled={uploading}
        className="hidden"
        multiple={false}
      />
      
      <Button
        variant="outline"
        onClick={handleButtonClick}
        disabled={uploading}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Téléchargement..." : "Changer la photo"}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Formats acceptés : {ALLOWED_EXTENSIONS.join(', ').toUpperCase()} (max 5MB)
      </p>
    </div>
  );
};
