import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ShopProduct {
  id: string;
  title: string;
  description: string | null;
  price: number;
  originalPrice?: number;
  instructor?: string;
  instructor_id?: string;
  category_id: string;
  image: string;
  type: 'formation' | 'article' | 'service';
  badge?: string;
  discount?: string;
  rating: number;
  students: number;
}

type CategoryFilter = string | undefined;

export const useShopProducts = (categoryFilter?: CategoryFilter) => {
  return useQuery({
    queryKey: ['shop-products', categoryFilter],
    queryFn: async () => {
      // Fetch books/services from products
      let prodQuery = supabase
        .from('products')
        .select(`
          *,
          profiles:instructor_id (
            first_name,
            last_name,
            username
          )
        `)
        .eq('is_active', true)
        .in('product_type', ['article', 'service']);
      if (categoryFilter && categoryFilter !== 'all') {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryFilter)
          .single();
        if (category) {
          prodQuery = prodQuery.eq('category_id', category.id);
        }
      }
      const { data: products = [], error: prodError } = await prodQuery;
      if (prodError) throw prodError;
      const booksAndServices = products.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        originalPrice: p.original_price,
        instructor_id: p.instructor_id,
        instructor: p.profiles
          ? `${p.profiles.first_name || ''} ${p.profiles.last_name || ''}`.trim() ||
            p.profiles.username ||
            'Auteur'
          : 'Auteur',
        category_id: p.category_id,
        image: p.image_url || '/placeholder.svg',
        type: p.product_type,
        badge: p.badge,
        discount: p.discount_percentage ? `${p.discount_percentage}%` : undefined,
        rating: p.rating ?? 0,
        students: p.students_count ?? 0,
      }));

      // Fetch formations from formations table
      let formQuery = supabase
        .from('formations')
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
          formQuery = formQuery.eq('category_id', category.id);
        }
      }
      const { data: formations = [], error: formError } = await formQuery;
      if (formError) throw formError;
      const formationsData = formations.map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        price: f.price,
        originalPrice: f.original_price,
        instructor_id: f.instructor_id,
        instructor: f.profiles
          ? `${f.profiles.first_name || ''} ${f.profiles.last_name || ''}`.trim() ||
            f.profiles.username ||
            'Instructeur'
          : 'Instructeur',
        category_id: f.category_id,
        image: f.image_url || '/placeholder.svg',
        type: 'formation',
        badge: f.badge,
        discount: f.discount_percentage ? `${f.discount_percentage}%` : undefined,
        rating: f.rating ?? 0,
        students: f.students_count ?? 0,
      }));

      return [...formationsData, ...booksAndServices];
    },
  });
};
