
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Récupérer les vidéos les plus vues récemment
      const { data: popularVideos } = await supabase
        .from('videos')
        .select('id, title, views_count')
        .order('views_count', { ascending: false })
        .limit(3);

      // Récupérer les nouveaux utilisateurs des dernières 24h
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday);

      // Récupérer les commandes récentes
      const { count: recentOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday);

      return {
        popularVideos: popularVideos || [],
        newUsersToday: newUsersToday || 0,
        recentOrders: recentOrders || 0
      };
    },
    refetchInterval: 30000 // Actualiser toutes les 30 secondes
  });
};
