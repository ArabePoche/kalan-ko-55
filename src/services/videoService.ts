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
  },

  async syncViewsCount(videoId: string) {
    // Get current views count from database
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('views_count')
      .eq('id', videoId)
      .single();

    if (fetchError) throw fetchError;

    return video?.views_count || 0;
  }
};
