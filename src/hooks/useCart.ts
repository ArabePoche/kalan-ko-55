
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  instructor: string;
  image: string;
  type: 'formation' | 'article' | 'service';
  quantity: number;
}

export const useCart = () => {
  const [localItems, setLocalItems] = useState<CartItem[]>([]);
  const queryClient = useQueryClient();

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setLocalItems(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(localItems));
  }, [localItems]);

  // Hook pour récupérer le panier depuis Supabase (si utilisateur connecté)
  const { data: dbCartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            title,
            price,
            image_url,
            product_type,
            profiles:instructor_id (
              first_name,
              last_name,
              username
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      return data.map(item => ({
        id: item.product_id,
        title: item.products.title,
        price: item.products.price,
        instructor: item.products.profiles?.[0] ? 
          `${item.products.profiles[0].first_name || ''} ${item.products.profiles[0].last_name || ''}`.trim() || 
          item.products.profiles[0].username || 'Instructeur'
          : 'Instructeur',
        image: item.products.image_url || '/placeholder.svg',
        type: item.products.product_type,
        quantity: item.quantity
      }));
    },
    enabled: false // Désactivé par défaut, sera activé quand l'utilisateur se connecte
  });

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
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
  };

  const removeFromCart = (id: string) => {
    setLocalItems(prev => prev.filter(item => item.id !== id));
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
  };

  const clearCart = () => {
    setLocalItems([]);
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
    getTotalItems
  };
};
