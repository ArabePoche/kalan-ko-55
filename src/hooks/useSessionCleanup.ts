
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSessionCleanup = () => {
  useEffect(() => {
    const cleanupExpiredSessions = async () => {
      try {
        // Marquer comme terminées toutes les sessions sans heartbeat depuis plus de 3 minutes
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
        
        const { data, error } = await supabase
          .from('user_sessions')
          .update({ 
            ended_at: new Date().toISOString()
          })
          .lt('started_at', threeMinutesAgo.toISOString())
          .is('ended_at', null)
          .select();

        if (error) {
          console.error('Error cleaning up sessions:', error);
        } else if (data && data.length > 0) {
          console.log(`Cleaned up ${data.length} expired sessions`);
        }
      } catch (error) {
        console.error('Session cleanup failed:', error);
      }
    };

    // Nettoyer immédiatement
    cleanupExpiredSessions();

    // Puis nettoyer toutes les minutes
    const cleanupInterval = setInterval(cleanupExpiredSessions, 60000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);
};
