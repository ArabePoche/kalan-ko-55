
import { supabase } from '@/integrations/supabase/client';

export const commentActions = {
  async toggleCommentLike(commentId: string, userId: string) {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('video_comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingLike) {
      // Unlike - Remove from likes table
      const { error: deleteError } = await supabase
        .from('video_comment_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) throw deleteError;

      // Get updated likes count from database after trigger execution
      const { data: updatedComment, error: fetchError } = await supabase
        .from('video_comments')
        .select('likes_count')
        .eq('id', commentId)
        .single();

      if (fetchError) throw fetchError;

      return { isLiked: false, likesChange: -1, newCount: updatedComment.likes_count };
    } else {
      // Like - Add to likes table
      const { error: insertError } = await supabase
        .from('video_comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId
        });

      if (insertError) throw insertError;

      // Get updated likes count from database after trigger execution
      const { data: updatedComment, error: fetchError } = await supabase
        .from('video_comments')
        .select('likes_count')
        .eq('id', commentId)
        .single();

      if (fetchError) throw fetchError;

      return { isLiked: true, likesChange: 1, newCount: updatedComment.likes_count };
    }
  }
};
