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

  // This is the main effect for synchronizing the cart state.
  // It handles both logged-in users (from DB) and guests (from localStorage).
  useEffect(() => {
    // Wait until we know the user's auth status.
    if (authLoading) {
      return;
    }

    if (user) {
      // User is logged in. The database is the source of truth.
      // Wait for the cart data to be fetched from the DB.
      if (cartLoading) {
        return;
      }
      setItems(dbCartItems);
    } else {
      // User is not logged in. LocalStorage is the source of truth.
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setItems(parsedCart);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          setItems([]);
        }
      } else {
        setItems([]);
      }
    }
    setIsInitialized(true);
  }, [user, authLoading, cartLoading, dbCartItems]);

  // This effect persists the cart to localStorage, but ONLY for guest users.
  useEffect(() => {
    if (!user && isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    if (user) {
      addToCartMutation.mutate(item);
    } else {
      setItems(prev => {
        const existingItem = prev.find(i => i.id === item.id);
        if (existingItem) {
          return prev.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    }
  };

  const removeFromCart = (id: string) => {
    if (user) {
      removeFromCartMutation.mutate(id);
    } else {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (user) {
      updateQuantityMutation.mutate({ productId: id, quantity });
    } else {
      if (quantity <= 0) {
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, quantity } : item
        ));
      }
    }
  };

  const clearCart = () => {
    if (user) {
      clearCartMutation.mutate();
    } else {
      setItems([]);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items,
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
