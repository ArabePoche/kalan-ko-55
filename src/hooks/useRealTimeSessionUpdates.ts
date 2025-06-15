
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useRealTimeSessionUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Écouter les changements en temps réel sur la table user_sessions
    const channel = supabase
      .channel('user-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'user_sessions'
        },
        (payload) => {
          console.log('Session change detected:', payload);
          
          // Invalider et refetch les données d'activité utilisateur
          queryClient.invalidateQueries({ queryKey: ['user-activity'] });
          queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
          queryClient.invalidateQueries({ queryKey: ['user-session-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
