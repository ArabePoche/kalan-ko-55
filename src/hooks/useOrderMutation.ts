
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CartItem } from '@/types/cart';

export const useOrderMutation = (
  clearCart: () => Promise<void>, 
  navigate: (path: string) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ items, totalPrice }: { items: CartItem[], totalPrice: number }) => {
      console.log('=== STARTING ORDER CREATION ===');
      console.log('Cart items:', items);
      console.log('Total price:', totalPrice);

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

      // Validation des données
      if (!items || items.length === 0) {
        throw new Error('Le panier est vide');
      }

      if (!totalPrice || totalPrice <= 0) {
        throw new Error('Le montant total doit être supérieur à 0');
      }

      const totalAmount = Number(totalPrice);
      console.log('Creating order with amount:', totalAmount);

      // Créer la commande avec gestion d'erreur détaillée
      console.log('Attempting to insert order...');
      const orderData = {
        user_id: user.id,
        total_amount: totalAmount,
        status: 'pending'
      };
      console.log('Order data to insert:', orderData);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      console.log('Order creation result - Data:', order);
      console.log('Order creation result - Error:', orderError);

      if (orderError) {
        console.error('Error creating order:', orderError);
        console.error('Error details:', JSON.stringify(orderError, null, 2));
        throw new Error(`Erreur lors de la création de la commande: ${orderError.message}`);
      }

      if (!order) {
        console.error('No order returned after creation');
        throw new Error('Aucune commande retournée après création');
      }

      console.log('Order created successfully:', order);

      // Créer les items de commande avec validation
      const orderItems = items.map(item => {
        if (!item.id || !item.price || !item.quantity) {
          throw new Error(`Article invalide: ${JSON.stringify(item)}`);
        }
        return {
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: Number(item.price)
        };
      });

      console.log('Creating order items:', orderItems);

      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      console.log('Order items creation result - Data:', orderItemsData);
      console.log('Order items creation result - Error:', itemsError);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        console.error('Items error details:', JSON.stringify(itemsError, null, 2));
        // Si les items échouent, on essaie de supprimer la commande créée
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error(`Erreur lors de la création des articles: ${itemsError.message}`);
      }

      console.log('Order items created successfully');
      console.log('Notifications should be created by database trigger');
      console.log('=== ORDER CREATION COMPLETED ===');

      return order;
    },
    onSuccess: async (order) => {
      console.log('Order process completed successfully:', order);
      
      try {
        // Vider le panier
        await clearCart();
        console.log('Cart cleared successfully');
        
        // Invalider les requêtes pour forcer la mise à jour
        await queryClient.invalidateQueries({ queryKey: ['cart'] });
        await queryClient.invalidateQueries({ queryKey: ['notifications'] });
        console.log('Queries invalidated successfully');
        
        toast({
          title: "Commande passée avec succès !",
          description: "Votre commande a été soumise et sera examinée par un administrateur.",
        });
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Error in onSuccess:', error);
        // Ne pas faire échouer tout le processus si le nettoyage échoue
        toast({
          title: "Commande créée",
          description: "Votre commande a été créée mais il y a eu un problème de synchronisation. Rechargez la page.",
        });
      }
    },
    onError: (error) => {
      console.error('=== ORDER CREATION FAILED ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible de passer la commande. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  });
};
