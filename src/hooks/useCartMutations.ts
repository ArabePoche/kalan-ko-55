
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CartItem } from '@/types/cart';

export const useCartMutations = () => {
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<CartItem, 'quantity'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', user.id)
          .eq('product_id', item.id)
          .single();

        if (existingItem) {
          const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('id', existingItem.id);
          
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: item.id,
              quantity: 1
            });
          
          if (insertError) throw insertError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier.",
      });
    },
    onError: (error) => {
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        if (quantity <= 0) {
          const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);
            
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', user.id)
            .eq('product_id', productId);
            
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Panier vidé",
        description: "Votre panier a été vidé avec succès.",
      });
    },
    onError: (error) => {
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
