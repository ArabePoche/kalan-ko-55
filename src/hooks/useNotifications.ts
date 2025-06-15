
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'order';
  user_id: string | null;
  is_for_all_admins: boolean;
  is_read: boolean;
  order_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading: loading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user logged in, returning empty notifications');
        return [];
      }

      console.log('Fetching notifications for user:', user.id);

      // D'abord, récupérer le profil de l'utilisateur pour vérifier son rôle
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('User profile:', profile);

      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      // Si l'utilisateur est admin, récupérer toutes ses notifications + celles pour tous les admins
      if (profile?.role === 'admin') {
        query = query.or(`user_id.eq.${user.id},is_for_all_admins.eq.true`);
      } else {
        // Sinon, seulement ses notifications personnelles
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
      
      console.log('Raw notifications data:', data);
      
      return (data || []).map(notification => ({
        ...notification,
        type: notification.type as 'info' | 'success' | 'warning' | 'error' | 'order'
      }));
    },
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('Marking notification as read:', notificationId);
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('Marking all notifications as read for user:', user.id);

      // Récupérer le profil pour vérifier le rôle
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (profile?.role === 'admin') {
        query = query.or(`user_id.eq.${user.id},is_for_all_admins.eq.true`);
      } else {
        query = query.eq('user_id', user.id);
      }

      const { error } = await query;

      if (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  console.log('Notifications hook result:', { 
    notificationsCount: notifications.length, 
    unreadCount,
    loading 
  });

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    unreadCount
  };
};
