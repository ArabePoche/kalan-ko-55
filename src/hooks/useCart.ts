
import { useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { useCartQueries } from './useCartQueries';
import { useCartMutations } from './useCartMutations';

export const useCart = () => {
  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  const { dbCartItems, isLoading } = useCartQueries();
  const { 
    addToCartMutation, 
    removeFromCartMutation, 
    updateQuantityMutation, 
    clearCartMutation 
  } = useCartMutations();

  // Synchroniser les données de la DB avec le state local
  useEffect(() => {
    if (dbCartItems.length > 0) {
      console.log('Syncing database items to local state:', dbCartItems);
      setLocalItems(dbCartItems);
    } else if (!isLoading) {
      // Charger depuis localStorage seulement si pas d'items en DB et que le chargement est terminé
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log('Loading from localStorage:', parsedCart);
          setLocalItems(parsedCart);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          localStorage.removeItem('cart');
          setLocalItems([]);
        }
      } else {
        setLocalItems([]);
      }
    }
  }, [dbCartItems, isLoading]);

  // Sauvegarder le panier dans localStorage seulement si pas en cours de chargement
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(localItems));
    }
  }, [localItems, isLoading]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    console.log('Adding item to cart:', item);
    
    // Toujours ajouter au panier local d'abord
    setLocalItems(prev => {
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

    // Essayer d'ajouter à la base de données si connecté
    addToCartMutation.mutate(item);
  };

  const removeFromCart = (id: string) => {
    console.log('Removing item from cart:', id);
    setLocalItems(prev => prev.filter(item => item.id !== id));
    removeFromCartMutation.mutate(id);
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('Updating quantity for item:', id, 'to:', quantity);
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setLocalItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
    updateQuantityMutation.mutate({ productId: id, quantity });
  };

  const clearCart = () => {
    console.log('Clearing cart - current items:', localItems.length);
    setLocalItems([]);
    localStorage.removeItem('cart');
    clearCartMutation.mutate();
  };

  const getTotalPrice = () => {
    return localItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return localItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items: localItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isLoading
  };
};

export type { CartItem };
