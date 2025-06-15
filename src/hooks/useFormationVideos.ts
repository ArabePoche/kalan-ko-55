
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FormationVideo {
  id: string;
  title: string;
  video_url: string | null;
  thumbnail_url: string | null;
  video_type: string;
}

export const useFormationVideos = () => {
  return useQuery({
    queryKey: ['formation-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('id, title, video_url, thumbnail_url, video_type')
        .eq('is_active', true)
        .order('title');
      
      if (error) throw error;
      
      return data as FormationVideo[];
    }
  });
};
