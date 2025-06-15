
import { useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';
import { useCartQueries } from './useCartQueries';
import { useCartMutations } from './useCartMutations';
import { useAuth } from '@/contexts/AuthProvider';

export const useCart = () => {
  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  const { dbCartItems, isLoading } = useCartQueries();
  const { user, loading: authLoading } = useAuth();
  const { 
    addToCartMutation, 
    removeFromCartMutation, 
    updateQuantityMutation, 
    clearCartMutation 
  } = useCartMutations();

  console.log('=== CART DEBUG ===');
  console.log('DB Cart Items:', dbCartItems);
  console.log('Local Items:', localItems);
  console.log('Is Loading:', isLoading);
  console.log('Auth Loading:', authLoading);
  console.log('User:', user);

  // Synchroniser les données de la DB avec le state local
  useEffect(() => {
    console.log('=== CART SYNC EFFECT ===');
    console.log('DB Items:', dbCartItems);
    console.log('Is Loading:', isLoading);
    console.log('Auth Loading:', authLoading);
    console.log('User exists:', !!user);
    
    // Ne pas synchroniser si l'auth est en cours de chargement
    if (authLoading) {
      console.log('Auth loading, skipping sync');
      return;
    }
    
    if (user && dbCartItems.length > 0) {
      console.log('User authenticated and has DB items, syncing to local state:', dbCartItems);
      setLocalItems(dbCartItems);
    } else if (!user && !isLoading && !authLoading) {
      // Charger depuis localStorage seulement si pas d'utilisateur et que les chargements sont terminés
      const savedCart = localStorage.getItem('cart');
      console.log('No user, loading from localStorage:', savedCart);
      
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
        console.log('No saved cart found, setting empty array');
        setLocalItems([]);
      }
    }
  }, [dbCartItems, isLoading, authLoading, user]);

  // Sauvegarder le panier dans localStorage seulement si pas en cours de chargement
  useEffect(() => {
    console.log('=== LOCALSTORAGE SAVE EFFECT ===');
    console.log('Is Loading:', isLoading);
    console.log('Auth Loading:', authLoading);
    console.log('Local Items to save:', localItems);
    
    // Ne pas sauvegarder si l'auth ou les données sont en cours de chargement
    if (!isLoading && !authLoading) {
      localStorage.setItem('cart', JSON.stringify(localItems));
      console.log('Saved to localStorage:', JSON.stringify(localItems));
    }
  }, [localItems, isLoading, authLoading]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    console.log('=== ADD TO CART ===');
    console.log('Adding item to cart:', item);
    console.log('Current local items before add:', localItems);
    
    // Toujours ajouter au panier local d'abord
    setLocalItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      let newItems;
      
      if (existingItem) {
        newItems = prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...prev, { ...item, quantity: 1 }];
      }
      
      console.log('New local items after add:', newItems);
      return newItems;
    });

    // Essayer d'ajouter à la base de données si connecté
    if (user) {
      console.log('User authenticated, triggering database mutation...');
      addToCartMutation.mutate(item);
    } else {
      console.log('No user authenticated, only saving locally');
    }
  };

  const removeFromCart = (id: string) => {
    console.log('=== REMOVE FROM CART ===');
    console.log('Removing item from cart:', id);
    console.log('Current local items before remove:', localItems);
    
    setLocalItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      console.log('New local items after remove:', newItems);
      return newItems;
    });
    
    if (user) {
      removeFromCartMutation.mutate(id);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('=== UPDATE QUANTITY ===');
    console.log('Updating quantity for item:', id, 'to:', quantity);
    
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setLocalItems(prev => {
      const newItems = prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      console.log('New local items after quantity update:', newItems);
      return newItems;
    });
    
    if (user) {
      updateQuantityMutation.mutate({ productId: id, quantity });
    }
  };

  const clearCart = () => {
    console.log('=== CLEAR CART ===');
    console.log('Clearing cart - forcing complete clear');
    console.log('Current local items before clear:', localItems);
    
    // Vider immédiatement le state local
    setLocalItems([]);
    
    // Vider le localStorage immédiatement
    localStorage.removeItem('cart');
    console.log('Cleared localStorage');
    
    // Vider la base de données si utilisateur connecté
    if (user) {
      clearCartMutation.mutate();
    }
  };

  const getTotalPrice = () => {
    const total = localItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('Calculated total price:', total, 'from items:', localItems);
    return total;
  };

  const getTotalItems = () => {
    const total = localItems.reduce((total, item) => total + item.quantity, 0);
    console.log('Calculated total items:', total);
    return total;
  };

  console.log('=== CART HOOK RETURN ===');
  console.log('Returning items:', localItems);
  console.log('Items count:', localItems.length);

  return {
    items: localItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isLoading: isLoading || authLoading
  };
};

export type { CartItem };
