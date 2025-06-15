
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Récupérer le nombre total de vidéos
      const { count: videosCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre total de formations
      const { count: formationsCount } = await supabase
        .from('formations')
        .select('*', { count: 'exact', head: true });

      // Récupérer le nombre d'utilisateurs actifs (connectés dans les 7 derniers jours)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: activeUsersCount } = await supabase
        .from('user_sessions')
        .select('user_id', { count: 'exact', head: true })
        .gte('started_at', sevenDaysAgo);

      // Récupérer les revenus de ce mois
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', firstDayOfMonth);

      const monthlyRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

      return {
        videosCount: videosCount || 0,
        formationsCount: formationsCount || 0,
        activeUsersCount: activeUsersCount || 0,
        monthlyRevenue
      };
    },
    refetchInterval: 60000 // Actualiser toutes les minutes
  });
};
