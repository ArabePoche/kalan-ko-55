
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
      console.log('=== STARTING ORDER CREATION ===');
      console.log('Cart items:', items);
      console.log('Total price:', getTotalPrice());

      // Vérifier l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth check - User:', user);
      console.log('Auth check - Error:', authError);
      
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Erreur d\'authentification: ' + authError.message);
      }
      
      if (!user) {
        console.error('No user found');
        throw new Error('Utilisateur non connecté');
      }

      console.log('User authenticated successfully:', user.id);

      const totalAmount = getTotalPrice();
      console.log('Creating order with amount:', totalAmount);

      // Créer la commande
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();

      console.log('Order creation result - Data:', order);
      console.log('Order creation result - Error:', orderError);

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error('Erreur lors de la création de la commande: ' + orderError.message);
      }

      if (!order) {
        console.error('No order returned after creation');
        throw new Error('Aucune commande retournée après création');
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

      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      console.log('Order items creation result - Data:', orderItemsData);
      console.log('Order items creation result - Error:', itemsError);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw new Error('Erreur lors de la création des articles de commande: ' + itemsError.message);
      }

      console.log('Order items created successfully');

      // Créer les notifications manuellement
      console.log('Creating notifications for order:', order.id);

      // Notification pour tous les admins
      const { data: adminNotificationData, error: adminNotificationError } = await supabase
        .from('notifications')
        .insert({
          title: 'Nouvelle commande à valider',
          message: `Une nouvelle commande d'un montant de ${order.total_amount}€ nécessite votre validation.`,
          type: 'order',
          is_for_all_admins: true,
          order_id: order.id
        })
        .select();

      console.log('Admin notification creation result - Data:', adminNotificationData);
      console.log('Admin notification creation result - Error:', adminNotificationError);

      if (adminNotificationError) {
        console.error('Error creating admin notification:', adminNotificationError);
        // Ne pas faire échouer la commande pour une erreur de notification
      }

      // Notification pour l'acheteur
      const { data: buyerNotificationData, error: buyerNotificationError } = await supabase
        .from('notifications')
        .insert({
          title: 'Commande passée avec succès',
          message: `Votre commande d'un montant de ${order.total_amount}€ a été soumise et sera examinée par un administrateur.`,
          type: 'order',
          user_id: user.id,
          order_id: order.id
        })
        .select();

      console.log('Buyer notification creation result - Data:', buyerNotificationData);
      console.log('Buyer notification creation result - Error:', buyerNotificationError);

      if (buyerNotificationError) {
        console.error('Error creating buyer notification:', buyerNotificationError);
        // Ne pas faire échouer la commande pour une erreur de notification
      }

      console.log('Notifications created successfully');
      console.log('=== ORDER CREATION COMPLETED ===');

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
      console.error('=== ORDER CREATION FAILED ===');
      console.error('Error details:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de passer la commande. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });
};
