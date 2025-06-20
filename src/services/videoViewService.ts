
import { supabase } from '@/integrations/supabase/client';

export const videoViewService = {
  async incrementView(videoId: string) {
    try {
      console.log('Incrementing view for video:', videoId);
      
      // Get current video views
      const { data: currentVideo, error: fetchError } = await supabase
        .from('videos')
        .select('views_count')
        .eq('id', videoId)
        .single();

      if (fetchError) {
        console.error('Error fetching video views:', fetchError);
        return null;
      }

      const newViewCount = (currentVideo?.views_count || 0) + 1;

      const { error: updateError } = await supabase
        .from('videos')
        .update({ views_count: newViewCount })
        .eq('id', videoId);

      if (updateError) {
        console.error('Error updating video views:', updateError);
        return null;
      }

      console.log(`Video ${videoId} views incremented to ${newViewCount}`);
      return newViewCount;
    } catch (error) {
      console.error('Error in incrementView:', error);
      return null;
    }
  }
};
