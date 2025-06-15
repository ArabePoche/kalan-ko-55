
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

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

  // Hook pour récupérer le panier depuis Supabase (si utilisateur connecté)
  const { data: dbCartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      console.log('Fetching cart items from database for user:', user.id);

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

      if (error) {
        console.error('Error fetching cart items:', error);
        throw error;
      }
      
      console.log('Database cart items:', data);
      
      return data.map(item => ({
        id: item.product_id,
        title: item.products?.title || 'Produit',
        price: item.products?.price || 0,
        instructor: item.products?.profiles?.[0] ? 
          `${item.products.profiles[0].first_name || ''} ${item.products.profiles[0].last_name || ''}`.trim() || 
          item.products.profiles[0].username || 'Instructeur'
          : 'Instructeur',
        image: item.products?.image_url || '/placeholder.svg',
        type: item.products?.product_type || 'formation',
        quantity: item.quantity
      }));
    },
    enabled: true // Activer la requête
  });

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

  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<CartItem, 'quantity'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('Adding item to database cart:', item);
        
        // Si utilisateur connecté, ajouter à la base de données
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', item.id)
          .single();

        if (existingItem) {
          // Augmenter la quantité
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('id', existingItem.id);
          
          if (error) throw error;
        } else {
          // Créer un nouvel item
          const { error } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: item.id,
              quantity: 1
            });
          
          if (error) throw error;
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
    getTotalItems,
    isLoading
  };
};
