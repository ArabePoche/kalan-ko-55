
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  ip_address: string | null;
  user_agent: string | null;
  user_profile?: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  };
}

export const useUserSessions = () => {
  return useQuery({
    queryKey: ['user-sessions'],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Récupérer les profils séparément
      const userIds = [...new Set(sessions.map(s => s.user_id))];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, username')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combiner les données
      return sessions.map(session => ({
        ...session,
        user_profile: profiles.find(p => p.id === session.user_id) || {
          first_name: null,
          last_name: null,
          username: null
        }
      })) as UserSession[];
    },
    refetchInterval: 30000
  });
};

export const useUserSessionStats = () => {
  return useQuery({
    queryKey: ['user-session-stats'],
    queryFn: async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      
      // Sessions actives (pas encore terminées)
      const { count: activeSessions } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .is('ended_at', null);

      // Temps moyen de session aujourd'hui
      const { data: todaySessions } = await supabase
        .from('user_sessions')
        .select('duration_minutes')
        .gte('started_at', todayStart)
        .not('duration_minutes', 'is', null);

      const avgSessionTime = todaySessions?.length 
        ? todaySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / todaySessions.length
        : 0;

      // Total des sessions aujourd'hui
      const { count: todaySessionsCount } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', todayStart);

      return {
        activeSessions: activeSessions || 0,
        avgSessionTime: Math.round(avgSessionTime),
        todaySessionsCount: todaySessionsCount || 0
      };
    },
    refetchInterval: 30000
  });
};
