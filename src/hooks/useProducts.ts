
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price?: number;
  instructor_id?: string;
  product_type: 'formation' | 'article' | 'service';
  category_id: string;
  image_url: string | null;
  badge?: string;
  discount_percentage?: number;
  rating: number;
  students_count: number;
  is_active: boolean;
  instructor?: {
    first_name?: string;
    last_name?: string;
    username?: string;
  };
}

export const useProducts = (categoryFilter?: string) => {
  return useQuery({
    queryKey: ['products', categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          profiles:instructor_id (
            first_name,
            last_name,
            username
          )
        `)
        .eq('is_active', true);

      if (categoryFilter && categoryFilter !== 'all') {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryFilter)
          .single();
        
        if (category) {
          query = query.eq('category_id', category.id);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(product => ({
        ...product,
        instructor: product.profiles?.[0] ? 
          `${product.profiles[0].first_name || ''} ${product.profiles[0].last_name || ''}`.trim() || 
          product.profiles[0].username || 'Instructeur' 
          : 'Instructeur',
        image: product.image_url || '/placeholder.svg',
        originalPrice: product.original_price,
        type: product.product_type,
        students: product.students_count,
        discount: product.discount_percentage ? `${product.discount_percentage}%` : undefined
      }));
    }
  });
};
