
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/cart';

export const useCartQueries = () => {
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
      })) as CartItem[];
    },
    enabled: true
  });

  return {
    dbCartItems,
    isLoading
  };
};
