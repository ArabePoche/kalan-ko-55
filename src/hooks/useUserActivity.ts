
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  is_online: boolean;
  activity_score: number;
}

export const useUserActivity = () => {
  return useQuery({
    queryKey: ['user-activity'],
    queryFn: async () => {
      // Récupérer les profils utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Pour chaque utilisateur, calculer un score d'activité basé sur des métriques simples
      const usersWithActivity = profiles.map(profile => {
        // Simuler un score d'activité basé sur la date de création et une activité récente simulée
        const daysSinceCreation = profile.created_at 
          ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        
        // Score basé sur l'ancienneté (plus récent = plus actif) et un facteur aléatoire pour simuler l'activité
        const activityScore = Math.max(0, 100 - daysSinceCreation + Math.floor(Math.random() * 50));
        
        // Simuler le statut en ligne (en réalité, ceci devrait venir d'un système de présence)
        const isOnline = Math.random() > 0.7; // 30% de chance d'être en ligne
        
        // Simuler la dernière connexion
        const lastSignInAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();

        return {
          ...profile,
          last_sign_in_at: lastSignInAt,
          is_online: isOnline,
          activity_score: activityScore,
        } as UserActivity;
      });

      // Trier par score d'activité décroissant
      return usersWithActivity.sort((a, b) => b.activity_score - a.activity_score);
    },
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });
};
