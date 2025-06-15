
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthProvider';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onAvatarUpdate: (url: string) => void;
  userInitials: string;
}

// Formats d'images autorisés pour les avatars
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export const AvatarUpload = ({ currentAvatarUrl, onAvatarUpdate, userInitials }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const validateImageFile = (file: File): string | null => {
    // Vérifier le type MIME
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `Format non autorisé. Formats acceptés : ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`;
    }

    // Vérifier l'extension du fichier
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return `Extension de fichier non autorisée. Extensions acceptées : ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}`;
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      return 'La taille du fichier ne doit pas dépasser 5MB.';
    }

    return null; // Pas d'erreur
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      console.log('Starting avatar upload...');

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à télécharger.');
      }

      if (!user) {
        throw new Error('Vous devez être connecté pour télécharger une photo.');
      }

      const file = event.target.files[0];
      console.log('Selected file:', file.name, file.type, file.size);
      
      // Valider le fichier image
      const validationError = validateImageFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      console.log('Uploading file to path:', filePath);

      // Check if avatars bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);
      
      if (bucketsError) {
        console.error('Error checking buckets:', bucketsError);
        throw new Error('Erreur lors de la vérification du stockage.');
      }

      const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars');
      if (!avatarsBucket) {
        console.error('Avatars bucket not found');
        throw new Error('Le stockage pour les avatars n\'est pas configuré. Contactez l\'administrateur.');
      }

      console.log('Avatars bucket found:', avatarsBucket);

      // First, delete any existing avatar for this user
      const { data: existingFiles, error: listError } = await supabase.storage
        .from('avatars')
        .list(user.id);

      if (listError) {
        console.error('Error listing existing files:', listError);
        // Don't throw here, just log and continue
      } else if (existingFiles && existingFiles.length > 0) {
        console.log('Deleting existing files:', existingFiles);
        for (const existingFile of existingFiles) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${existingFile.name}`]);
          
          if (deleteError) {
            console.error('Error deleting existing file:', deleteError);
            // Don't throw here, just log and continue
          }
        }
      }

      // Upload new file to Supabase Storage
      console.log('Uploading file...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erreur lors du téléchargement: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', data.publicUrl);

      if (data.publicUrl) {
        // Test if the URL is accessible
        try {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          console.log('URL accessibility test:', response.status);
          
          if (!response.ok) {
            throw new Error('L\'URL générée n\'est pas accessible.');
          }
        } catch (fetchError) {
          console.error('URL accessibility test failed:', fetchError);
          throw new Error('Impossible de vérifier l\'accessibilité de l\'image.');
        }

        onAvatarUpdate(data.publicUrl);
        
        toast({
          title: "Avatar mis à jour",
          description: "Votre photo de profil a été mise à jour avec succès.",
        });
      } else {
        throw new Error('Impossible de générer l\'URL publique de l\'image.');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        variant: "destructive",
        title: "Erreur de téléchargement",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du téléchargement.",
      });
    } finally {
      setUploading(false);
      // Reset the input value so the same file can be selected again
      if (event.target) {
        event.target.value = '';
      }
    }
  };

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
