import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CartItem } from '@/types/cart';
import { useAuth } from '@/contexts/AuthProvider';

export const useCartMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = ['cart', user?.id];

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
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCart = queryClient.getQueryData(queryKey) as CartItem[] | undefined;
      
      queryClient.setQueryData(queryKey, (old: CartItem[] = []) => {
          const existingItem = old.find(i => i.id === newItem.id);
          if (existingItem) {
              return old.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
          }
          return [...old, { ...newItem, quantity: 1 }];
      });

      return { previousCart };
    },
    onSuccess: () => {
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier.",
      });
    },
    onError: (error, variables, context) => {
      if(context?.previousCart) {
          queryClient.setQueryData(queryKey, context.previousCart);
      }
      console.error('Error adding to cart:', error);
      toast({
          title: "Erreur",
          description: "Impossible d'ajouter le produit au panier.",
          variant: "destructive"
      });
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
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
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCart = queryClient.getQueryData(queryKey) as CartItem[] | undefined;
      
      queryClient.setQueryData(queryKey, (old: CartItem[] = []) => {
          return old.filter(item => item.id !== productId);
      });

      return { previousCart };
    },
    onError: (error, variables, context) => {
      if(context?.previousCart) {
          queryClient.setQueryData(queryKey, context.previousCart);
      }
      console.error('Error removing from cart:', error);
      toast({
          title: "Erreur",
          description: "Impossible de supprimer le produit du panier.",
          variant: "destructive"
      });
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
    },
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
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCart = queryClient.getQueryData(queryKey) as CartItem[] | undefined;

      queryClient.setQueryData(queryKey, (old: CartItem[] = []) => {
          if (quantity <= 0) {
              return old.filter(item => item.id !== productId);
          }
          return old.map(item => item.id === productId ? { ...item, quantity } : item);
      });

      return { previousCart };
    },
    onError: (error, variables, context) => {
      if(context?.previousCart) {
          queryClient.setQueryData(queryKey, context.previousCart);
      }
      console.error('Error updating quantity:', error);
      toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la quantité.",
          variant: "destructive"
      });
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
    },
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousCart = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, []);
      return { previousCart };
    },
    onSuccess: () => {
      toast({
        title: "Panier vidé",
        description: "Votre panier a été vidé avec succès.",
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
          queryClient.setQueryData(queryKey, context.previousCart);
      }
      console.error('Error clearing cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  return {
    addToCartMutation,
    removeFromCartMutation,
    updateQuantityMutation,
    clearCartMutation
  };
};
