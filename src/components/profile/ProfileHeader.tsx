
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditProfileForm } from '../EditProfileForm';
import { AvatarUpload } from '../AvatarUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Tables } from '@/integrations/supabase/types';
import { User } from '@supabase/supabase-js';

interface ProfileHeaderProps {
  profile: Tables<'profiles'>;
  user: User;
  signOut: () => Promise<void>;
}

export const ProfileHeader = ({ profile, user, signOut }: ProfileHeaderProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const userInitials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`;

  const handleAvatarUpdate = async (url: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      setIsAvatarDialogOpen(false);
    } catch (error) {
      console.error('Avatar update failed:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre avatar.",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
      <div className="relative cursor-pointer" onClick={() => setIsAvatarDialogOpen(true)}>
        <Avatar className="w-24 h-24">
          <AvatarImage src={profile?.avatar_url || "https://github.com/shadcn.png"} alt="@shadcn" />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold">{profile?.first_name} {profile?.last_name}</h1>
        <p className="text-muted-foreground">@{profile?.username || user.email}</p>
      </div>
      <div className="flex gap-2 md:ml-auto">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le profil</DialogTitle>
              <DialogDescription>
                Mettez à jour vos informations. Cliquez sur enregistrer lorsque vous avez terminé.
              </DialogDescription>
            </DialogHeader>
            <EditProfileForm profile={profile} onSuccess={() => setIsEditDialogOpen(false)} />
          </DialogContent>
        </Dialog>
        
        <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Changer la photo de profil</DialogTitle>
              <DialogDescription>
                Téléchargez une nouvelle photo de profil.
              </DialogDescription>
            </DialogHeader>
            <AvatarUpload
              currentAvatarUrl={profile?.avatar_url}
              onAvatarUpdate={handleAvatarUpdate}
              userInitials={userInitials}
            />
          </DialogContent>
        </Dialog>
        
        <Button onClick={signOut} variant="outline">Se déconnecter</Button>
      </div>
    </div>
  );
};
