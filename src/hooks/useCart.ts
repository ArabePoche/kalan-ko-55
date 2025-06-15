
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

  console.log('=== CART DEBUG ===');
  console.log('DB Cart Items:', dbCartItems);
  console.log('Local Items:', localItems);
  console.log('Is Loading:', isLoading);

  // Synchroniser les données de la DB avec le state local
  useEffect(() => {
    console.log('=== CART SYNC EFFECT ===');
    console.log('DB Items:', dbCartItems);
    console.log('Is Loading:', isLoading);
    
    if (dbCartItems.length > 0) {
      console.log('Syncing database items to local state:', dbCartItems);
      setLocalItems(dbCartItems);
    } else if (!isLoading) {
      // Charger depuis localStorage seulement si pas d'items en DB et que le chargement est terminé
      const savedCart = localStorage.getItem('cart');
      console.log('Saved cart from localStorage:', savedCart);
      
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
  }, [dbCartItems, isLoading]);

  // Sauvegarder le panier dans localStorage seulement si pas en cours de chargement
  useEffect(() => {
    console.log('=== LOCALSTORAGE SAVE EFFECT ===');
    console.log('Is Loading:', isLoading);
    console.log('Local Items to save:', localItems);
    
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(localItems));
      console.log('Saved to localStorage:', JSON.stringify(localItems));
    }
  }, [localItems, isLoading]);

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
    console.log('Triggering database mutation...');
    addToCartMutation.mutate(item);
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
    
    removeFromCartMutation.mutate(id);
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
    
    updateQuantityMutation.mutate({ productId: id, quantity });
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
    
    // Vider la base de données
    clearCartMutation.mutate();
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
    isLoading
  };
};

export type { CartItem };
