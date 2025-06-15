
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSessionSimulator = () => {
  useEffect(() => {
    const createSessionIfNeeded = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Vérifier s'il y a une session active pour cet utilisateur
        const { data: activeSessions } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id)
          .is('ended_at', null);

        // Si pas de session active, en créer une
        if (!activeSessions || activeSessions.length === 0) {
          const { error } = await supabase
            .from('user_sessions')
            .insert({
              user_id: user.id,
              started_at: new Date().toISOString(),
              ip_address: '127.0.0.1',
              user_agent: navigator.userAgent
            });

          if (error) {
            console.error('Error creating session:', error);
          } else {
            console.log('Session created for user:', user.id);
          }
        }
      } catch (error) {
        console.error('Error in session simulator:', error);
      }
    };

    createSessionIfNeeded();

    // Mettre à jour le timestamp de la session toutes les 5 minutes
    const interval = setInterval(() => {
      createSessionIfNeeded();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};
