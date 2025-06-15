
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
      const { data, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          profiles!inner(first_name, last_name, username)
        `)
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return data.map(session => ({
        ...session,
        user_profile: session.profiles
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
