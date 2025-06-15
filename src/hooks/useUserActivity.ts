
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
      console.log('Fetching user activity data...');
      
      // Récupérer les profils utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles fetched:', profiles.length);

      // Définir les seuils de temps
      const now = new Date();
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes pour être considéré en ligne
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Pour chaque utilisateur, récupérer les données de session
      const usersWithActivity = await Promise.all(profiles.map(async (profile) => {
        // Récupérer les sessions de l'utilisateur
        const { data: sessions } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', profile.id)
          .order('started_at', { ascending: false });

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

        // Utilisateur en ligne : session active avec heartbeat récent (moins de 2 minutes)
        const isOnline = sessions?.some(session => {
          const sessionStart = new Date(session.started_at);
          const isActive = !session.ended_at; // Session pas encore terminée
          const hasRecentHeartbeat = sessionStart > twoMinutesAgo; // Heartbeat récent
          
          return isActive && hasRecentHeartbeat;
        }) || false;

        console.log(`User ${profile.username} online status:`, {
          hasActiveSessions: sessions?.filter(s => !s.ended_at).length || 0,
          hasRecentHeartbeat: sessions?.some(s => new Date(s.started_at) > twoMinutesAgo) || false,
          isOnline
        });

        // Score d'activité basé sur les données réelles
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

      console.log('Users with online status:', usersWithActivity.filter(u => u.is_online).length);

      // Trier par score d'activité décroissant
      return usersWithActivity.sort((a, b) => b.activity_score - a.activity_score);
    },
    refetchInterval: 10000, // Actualiser toutes les 10 secondes pour une détection plus rapide
  });
};
