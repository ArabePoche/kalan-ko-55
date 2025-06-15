
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
      console.log('Fetching user sessions...');
      
      const { data, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          profiles(first_name, last_name, username)
        `)
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }
      if (!data) {
        console.log('No session data returned');
        return [];
      }

      console.log('Raw session data:', data);

      const validSessions = data.filter(session => session.profiles);
      console.log('Valid sessions with profiles:', validSessions);

      return validSessions.map(session => ({
        ...session,
        user_profile: session.profiles as { first_name: string | null; last_name: string | null; username: string | null; }
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
      
      console.log('Fetching session stats...');
      
      // Sessions actives (pas encore terminées)
      const { count: activeSessions, error: activeError } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .is('ended_at', null);

      if (activeError) {
        console.error('Error fetching active sessions:', activeError);
      } else {
        console.log('Active sessions count:', activeSessions);
      }

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

      const stats = {
        activeSessions: activeSessions || 0,
        avgSessionTime: Math.round(avgSessionTime),
        todaySessionsCount: todaySessionsCount || 0
      };

      console.log('Session stats:', stats);

      return stats;
    },
    refetchInterval: 30000
  });
};
