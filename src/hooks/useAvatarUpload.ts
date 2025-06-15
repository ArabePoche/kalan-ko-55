
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthProvider';
import { validateImageFile } from '@/utils/avatarValidation';

interface UseAvatarUploadProps {
  onAvatarUpdate: (url: string) => void;
}

export const useAvatarUpload = ({ onAvatarUpdate }: UseAvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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

  return {
    uploading,
    uploadAvatar
  };
};
