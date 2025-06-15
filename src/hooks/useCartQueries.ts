
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/types/cart';

export const useCartQueries = () => {
  const { data: dbCartItems = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      console.log('=== CART QUERY ===');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Cart query - User:', user);
      console.log('Cart query - User error:', userError);
      
      if (!user) {
        console.log('No user authenticated, returning empty cart');
        return [];
      }

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

      console.log('Database cart query result - Data:', data);
      console.log('Database cart query result - Error:', error);

      if (error) {
        console.error('Error fetching cart items:', error);
        throw error;
      }
      
      const mappedItems = data.map(item => ({
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
      
      console.log('Mapped cart items:', mappedItems);
      return mappedItems;
    },
    enabled: true
  });

  console.log('=== CART QUERIES HOOK ===');
  console.log('DB Cart Items:', dbCartItems);
  console.log('Is Loading:', isLoading);

  return {
    dbCartItems,
    isLoading
  };
};
