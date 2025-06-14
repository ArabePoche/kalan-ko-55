
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Video {
  id: string;
  title: string;
  description?: string;
  author_id?: string;
  video_url?: string;
  thumbnail_url?: string;
  video_type: 'promo' | 'educational' | 'testimonial';
  product_id?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  author?: {
    first_name?: string;
    last_name?: string;
    username?: string;
  };
}

export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles:author_id (
            first_name,
            last_name,
            username
          )
        `)
        .eq('is_active', true);
      
      if (error) throw error;
      
      return data.map(video => ({
        ...video,
        author: video.profiles?.[0] ? 
          `${video.profiles[0].first_name || ''} ${video.profiles[0].last_name || ''}`.trim() || 
          video.profiles[0].username || 'Auteur anonyme'
          : 'Auteur anonyme'
      }));
    }
  });
};
