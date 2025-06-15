
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CartItem } from '@/types/cart';

export const useCartMutations = () => {
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<CartItem, 'quantity'>) => {
      console.log('=== ADD TO CART MUTATION ===');
      console.log('Starting mutation for item:', item);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Auth check - User:', user);
      console.log('Auth check - Error:', userError);
      
      if (user) {
        console.log('User authenticated, adding to database cart:', item);
        
        const { data: existingItem, error: selectError } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', item.id)
          .single();

        console.log('Existing item check - Data:', existingItem);
        console.log('Existing item check - Error:', selectError);

        if (existingItem) {
          console.log('Item exists, updating quantity from', existingItem.quantity, 'to', existingItem.quantity + 1);
          
          const { data: updateData, error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('id', existingItem.id)
            .select();
          
          console.log('Update result - Data:', updateData);
          console.log('Update result - Error:', updateError);
          
          if (updateError) throw updateError;
        } else {
          console.log('Item does not exist, inserting new item');
          
          const { data: insertData, error: insertError } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: item.id,
              quantity: 1
            })
            .select();
          
          console.log('Insert result - Data:', insertData);
          console.log('Insert result - Error:', insertError);
          
          if (insertError) throw insertError;
        }
      } else {
        console.log('No user authenticated, skipping database operation');
      }
    },
    onSuccess: () => {
      console.log('=== ADD TO CART SUCCESS ===');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier.",
      });
    },
    onError: (error) => {
      console.error('=== ADD TO CART ERROR ===');
      console.error('Error adding to cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
        variant: "destructive"
      });
    }
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      console.log('=== REMOVE FROM CART MUTATION ===');
      console.log('Removing product:', productId);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('Removing item from database cart for user:', user.id);
        
        const { data, error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .select();
          
        console.log('Remove result - Data:', data);
        console.log('Remove result - Error:', error);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      console.log('=== REMOVE FROM CART SUCCESS ===');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('=== REMOVE FROM CART ERROR ===');
      console.error('Error removing from cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit du panier.",
        variant: "destructive"
      });
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      console.log('=== UPDATE QUANTITY MUTATION ===');
      console.log('Updating product:', productId, 'to quantity:', quantity);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('Updating quantity in database for user:', user.id);
        
        if (quantity <= 0) {
          const { data, error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .select();
            
          console.log('Delete result - Data:', data);
          console.log('Delete result - Error:', error);
          
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .select();
            
          console.log('Update result - Data:', data);
          console.log('Update result - Error:', error);
          
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      console.log('=== UPDATE QUANTITY SUCCESS ===');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('=== UPDATE QUANTITY ERROR ===');
      console.error('Error updating quantity:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité.",
        variant: "destructive"
      });
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      console.log('=== CLEAR CART MUTATION ===');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('Clearing cart from database for user:', user.id);
        
        const { data, error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .select();
          
        console.log('Clear result - Data:', data);
        console.log('Clear result - Error:', error);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      console.log('=== CLEAR CART SUCCESS ===');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Panier vidé",
        description: "Votre panier a été vidé avec succès.",
      });
    },
    onError: (error) => {
      console.error('=== CLEAR CART ERROR ===');
      console.error('Error clearing cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier.",
        variant: "destructive"
      });
    }
  });

  return {
    addToCartMutation,
    removeFromCartMutation,
    updateQuantityMutation,
    clearCartMutation
  };
};
