
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CartItem } from '@/types/cart';

export const useOrderMutation = (
  items: CartItem[], 
  getTotalPrice: () => number, 
  clearCart: () => void, 
  navigate: (path: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      console.log('Creating order for user:', user.id);
      console.log('Order items:', items);
      console.log('Total amount:', getTotalPrice());

      // Créer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotalPrice(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
      }

      console.log('Order created successfully:', order);

      // Créer les items de commande
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      console.log('Creating order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw itemsError;
      }

      console.log('Order items created successfully');

      // Créer les notifications manuellement
      console.log('Creating notifications for order:', order.id);

      // Notification pour tous les admins
      const { error: adminNotificationError } = await supabase
        .from('notifications')
        .insert({
          title: 'Nouvelle commande à valider',
          message: `Une nouvelle commande d'un montant de ${order.total_amount}€ nécessite votre validation.`,
          type: 'order',
          is_for_all_admins: true,
          order_id: order.id
        });

      if (adminNotificationError) {
        console.error('Error creating admin notification:', adminNotificationError);
        // Ne pas faire échouer la commande pour une erreur de notification
      }

      // Notification pour l'acheteur
      const { error: buyerNotificationError } = await supabase
        .from('notifications')
        .insert({
          title: 'Commande passée avec succès',
          message: `Votre commande d'un montant de ${order.total_amount}€ a été soumise et sera examinée par un administrateur.`,
          type: 'order',
          user_id: user.id,
          order_id: order.id
        });

      if (buyerNotificationError) {
        console.error('Error creating buyer notification:', buyerNotificationError);
        // Ne pas faire échouer la commande pour une erreur de notification
      }

      console.log('Notifications created successfully');

      return order;
    },
    onSuccess: (order) => {
      console.log('Order process completed successfully:', order);
      
      // Vider le panier immédiatement après succès
      clearCart();
      
      // Invalider les requêtes pour forcer la mise à jour
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      toast({
        title: "Commande passée avec succès !",
        description: "Votre commande a été soumise et sera examinée par un administrateur.",
      });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de passer la commande. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });
};
