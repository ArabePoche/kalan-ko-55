
import { supabase } from '@/integrations/supabase/client';

export const videoService = {
  async syncCommentsCount(videoId: string) {
    // Count actual comments (only top-level comments, not replies)
    const { data: comments, error: countError } = await supabase
      .from('video_comments')
      .select('id')
      .eq('video_id', videoId)
      .is('parent_comment_id', null);

    if (countError) throw countError;

    const actualCount = comments?.length || 0;

    // Update the video's comments_count
    const { error: updateError } = await supabase
      .from('videos')
      .update({ comments_count: actualCount })
      .eq('id', videoId);

    if (updateError) throw updateError;

    return actualCount;
  }
};
