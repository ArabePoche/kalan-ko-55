
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimeSession = () => {
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const currentSessionId = useRef<string | null>(null);

  useEffect(() => {
    const startSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Terminer toutes les sessions actives existantes pour cet utilisateur
        await supabase
          .from('user_sessions')
          .update({ 
            ended_at: new Date().toISOString(),
            duration_minutes: null 
          })
          .eq('user_id', user.id)
          .is('ended_at', null);

        // Créer une nouvelle session
        const { data: newSession, error } = await supabase
          .from('user_sessions')
          .insert({
            user_id: user.id,
            started_at: new Date().toISOString(),
            ip_address: '127.0.0.1',
            user_agent: navigator.userAgent
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating session:', error);
          return;
        }

        currentSessionId.current = newSession.id;
        console.log('New session created:', newSession.id);

        // Démarrer le heartbeat toutes les 30 secondes
        heartbeatInterval.current = setInterval(async () => {
          if (currentSessionId.current) {
            try {
              await supabase
                .from('user_sessions')
                .update({ 
                  started_at: new Date().toISOString() // Mettre à jour le timestamp pour indiquer l'activité
                })
                .eq('id', currentSessionId.current);
              
              console.log('Heartbeat sent for session:', currentSessionId.current);
            } catch (error) {
              console.error('Heartbeat failed:', error);
            }
          }
        }, 30000); // 30 secondes

      } catch (error) {
        console.error('Error in session management:', error);
      }
    };

    const endSession = async () => {
      if (currentSessionId.current) {
        try {
          const startTime = new Date();
          await supabase
            .from('user_sessions')
            .update({ 
              ended_at: new Date().toISOString()
            })
            .eq('id', currentSessionId.current);
          
          console.log('Session ended:', currentSessionId.current);
          currentSessionId.current = null;
        } catch (error) {
          console.error('Error ending session:', error);
        }
      }
    };

    // Démarrer la session
    startSession();

    // Gérer la fermeture du navigateur/onglet
    const handleBeforeUnload = () => {
      if (currentSessionId.current) {
        // Utiliser sendBeacon pour s'assurer que la requête est envoyée même si la page se ferme
        navigator.sendBeacon(
          `${supabase.supabaseUrl}/rest/v1/user_sessions?id=eq.${currentSessionId.current}`,
          JSON.stringify({ 
            ended_at: new Date().toISOString() 
          })
        );
      }
    };

    // Gérer la perte de focus/changement d'onglet
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // L'onglet devient inactif, on peut considérer l'utilisateur comme moins actif
        console.log('User went inactive');
      } else {
        // L'onglet redevient actif
        console.log('User became active');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
      endSession();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { currentSessionId: currentSessionId.current };
};
