
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
    } else {
      // Charger depuis localStorage seulement si pas d'items en DB
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log('Loading from localStorage:', parsedCart);
          setLocalItems(parsedCart);
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          localStorage.removeItem('cart');
        }
      }
    }
  }, [dbCartItems]);

  // Sauvegarder le panier dans localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(localItems));
  }, [localItems]);

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
    setLocalItems(prev => prev.filter(item => item.id !== id));
    removeFromCartMutation.mutate(id);
  };

  const updateQuantity = (id: string, quantity: number) => {
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
    setLocalItems([]);
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
