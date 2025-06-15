
import { supabase } from '@/integrations/supabase/client';

export const videoViewService = {
  async incrementView(videoId: string) {
    try {
      console.log('Incrementing view for video:', videoId);
      
      // Increment the views count directly
      const { data, error } = await supabase
        .from('videos')
        .update({ 
          views_count: supabase.sql`views_count + 1`
        })
        .eq('id', videoId)
        .select('views_count')
        .single();

      if (error) {
        console.error('Error updating video views:', error);
        return null;
      }

      const newViewCount = data?.views_count || 0;
      console.log(`Video ${videoId} views incremented to ${newViewCount}`);
      return newViewCount;
    } catch (error) {
      console.error('Error in incrementView:', error);
      return null;
    }
  }
};
