import { useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { useCartQueries } from './useCartQueries';
import { useCartMutations } from './useCartMutations';
import { useAuth } from '@/contexts/AuthProvider';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { dbCartItems, isLoading: cartLoading } = useCartQueries();
  const { user, loading: authLoading } = useAuth();
  const { 
    addToCartMutation, 
    removeFromCartMutation, 
    updateQuantityMutation, 
    clearCartMutation 
  } = useCartMutations();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user) {
      if (cartLoading) {
        return;
      }
      setItems(dbCartItems);
    } else {
      setItems([]);
    }
    setIsInitialized(true);
  }, [user, authLoading, cartLoading, dbCartItems]);

  useEffect(() => {
    if (user) {
    }
  }, [items, user, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    if (!user) {
      return;
    }
    addToCartMutation.mutate(item);
  };

  const removeFromCart = (id: string) => {
    if (!user) {
      return;
    }
    removeFromCartMutation.mutate(id);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (!user) {
      return;
    }
    updateQuantityMutation.mutate({ productId: id, quantity });
  };

  const clearCart = async () => {
    if (!user) {
      return;
    }
    await clearCartMutation.mutateAsync();
  };

  const getTotalPrice = () => {
    if (!user) return 0;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    if (!user) return 0;
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items: user ? items : [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isLoading: authLoading || (user ? cartLoading : !isInitialized)
  };
};

export type { CartItem };
