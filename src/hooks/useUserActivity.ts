
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
  total_session_time: number;
  sessions_today: number;
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

      // Pour chaque utilisateur, récupérer les données de session
      const usersWithActivity = await Promise.all(profiles.map(async (profile) => {
        // Récupérer les sessions de l'utilisateur
        const { data: sessions } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', profile.id)
          .order('started_at', { ascending: false });

        // Calculer les métriques d'activité
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Sessions aujourd'hui
        const sessionsToday = sessions?.filter(s => 
          new Date(s.started_at) >= today
        ).length || 0;

        // Temps total de session (en minutes)
        const totalSessionTime = sessions?.reduce((total, session) => {
          return total + (session.duration_minutes || 0);
        }, 0) || 0;

        // Dernière connexion réelle
        const lastSignInAt = sessions?.[0]?.started_at || profile.created_at;

        // Utilisateur en ligne (session active dans les 5 dernières minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const isOnline = sessions?.some(session => 
          !session.ended_at && new Date(session.started_at) > fiveMinutesAgo
        ) || false;

        // Score d'activité basé sur les données réelles
        const daysSinceCreation = profile.created_at 
          ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        
        const recentActivity = sessions?.filter(s => 
          new Date(s.started_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0;

        const activityScore = Math.min(100, (recentActivity * 20) + (totalSessionTime / 10) + (sessionsToday * 15));

        return {
          ...profile,
          last_sign_in_at: lastSignInAt,
          is_online: isOnline,
          activity_score: Math.round(activityScore),
          total_session_time: totalSessionTime,
          sessions_today: sessionsToday,
        } as UserActivity;
      }));

      // Trier par score d'activité décroissant
      return usersWithActivity.sort((a, b) => b.activity_score - a.activity_score);
    },
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });
};
