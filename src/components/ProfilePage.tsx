import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CoursesPage from "./CoursesPage";
import NotificationsFeed from "./NotificationsFeed";
import { useAuth } from '@/contexts/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
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
import { EditProfileForm } from './EditProfileForm';
import { AvatarUpload } from './AvatarUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const ProfilePage = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isLoading = authLoading || profileLoading;

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

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <p className="text-lg mb-4">Vous n'êtes pas connecté.</p>
        <p className="text-muted-foreground mb-6">Connectez-vous pour accéder à votre profil.</p>
        <Button asChild>
          <Link to="/auth">Se connecter / S'inscrire</Link>
        </Button>
      </div>
    );
  }

  if (!profile) {
     return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const userInitials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`;
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Formations suivies: 5</p>
            <p>Certificats obtenus: 2</p>
            <p>Heures d'apprentissage: 42</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Biographie</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{profile?.bio || "Cet utilisateur n'a pas encore de biographie."}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Mes Cours</h2>
          <CoursesPage />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Mes Commandes</h2>
          {/* Placeholder for orders */}
          <Card>
            <CardContent className="p-4">
              <p>Vous n'avez aucune commande récente.</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <NotificationsFeed />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
