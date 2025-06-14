
import { supabase } from '@/integrations/supabase/client';
import { VideoComment } from '@/types/comments';

export const commentService = {
  async fetchComments(videoId: string, userId?: string): Promise<VideoComment[]> {
    if (!videoId) return [];

    // Fetch top-level comments with user info
    const { data: commentsData, error } = await supabase
      .from('video_comments')
      .select(`
        id,
        content,
        likes_count,
        created_at,
        user:profiles!video_comments_user_id_fkey(
          id,
          username,
          first_name,
          last_name
        )
      `)
      .eq('video_id', videoId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      (commentsData || []).map(async (comment) => {
        // Fetch replies
        const { data: repliesData, error: repliesError } = await supabase
          .from('video_comments')
          .select(`
            id,
            content,
            likes_count,
            created_at,
            user:profiles!video_comments_user_id_fkey(
              id,
              username,
              first_name,
              last_name
            )
          `)
          .eq('parent_comment_id', comment.id)
          .order('created_at', { ascending: true });

        if (repliesError) throw repliesError;

        // Check which comments and replies are liked by current user
        let isLiked = false;
        if (userId) {
          const { data: likeData } = await supabase
            .from('video_comment_likes')
            .select('id')
            .eq('comment_id', comment.id)
            .eq('user_id', userId)
            .maybeSingle();
          
          isLiked = !!likeData;
        }

        // Process replies with like status
        const repliesWithLikes = await Promise.all(
          (repliesData || []).map(async (reply) => {
            let replyIsLiked = false;
            if (userId) {
              const { data: replyLikeData } = await supabase
                .from('video_comment_likes')
                .select('id')
                .eq('comment_id', reply.id)
                .eq('user_id', userId)
                .maybeSingle();
              
              replyIsLiked = !!replyLikeData;
            }

            return {
              id: reply.id,
              content: reply.content,
              likes_count: reply.likes_count || 0,
              created_at: reply.created_at,
              user: {
                id: reply.user?.id || '',
                username: reply.user?.username || 'Utilisateur',
                first_name: reply.user?.first_name || '',
                last_name: reply.user?.last_name || ''
              },
              isLiked: replyIsLiked,
              replies: []
            };
          })
        );

        return {
          id: comment.id,
          content: comment.content,
          likes_count: comment.likes_count || 0,
          created_at: comment.created_at,
          user: {
            id: comment.user?.id || '',
            username: comment.user?.username || 'Utilisateur',
            first_name: comment.user?.first_name || '',
            last_name: comment.user?.last_name || ''
          },
          isLiked,
          replies: repliesWithLikes
        };
      })
    );

    return commentsWithReplies;
  },

  async addComment(videoId: string, userId: string, content: string, userMetadata: any) {
    const { data: newComment, error } = await supabase
      .from('video_comments')
      .insert({
        video_id: videoId,
        user_id: userId,
        content: content.trim()
      })
      .select(`
        id,
        content,
        likes_count,
        created_at
      `)
      .single();

    if (error) throw error;

    // Return comment with user info
    const commentWithUser: VideoComment = {
      id: newComment.id,
      content: newComment.content,
      likes_count: 0,
      created_at: newComment.created_at,
      user: {
        id: userId,
        username: userMetadata?.username || 'Vous',
        first_name: userMetadata?.first_name || '',
        last_name: userMetadata?.last_name || ''
      },
      isLiked: false,
      replies: []
    };

    return commentWithUser;
  },

  async addReply(videoId: string, parentCommentId: string, userId: string, content: string, userMetadata: any) {
    const { data: newReply, error } = await supabase
      .from('video_comments')
      .insert({
        video_id: videoId,
        user_id: userId,
        parent_comment_id: parentCommentId,
        content: content.trim()
      })
      .select(`
        id,
        content,
        likes_count,
        created_at
      `)
      .single();

    if (error) throw error;

    // Return reply with user info
    const replyWithUser: VideoComment = {
      id: newReply.id,
      content: newReply.content,
      likes_count: 0,
      created_at: newReply.created_at,
      user: {
        id: userId,
        username: userMetadata?.username || 'Vous',
        first_name: userMetadata?.first_name || '',
        last_name: userMetadata?.last_name || ''
      },
      isLiked: false,
      replies: []
    };

    return replyWithUser;
  },

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

      // Get current comment and decrement likes_count
      const { data: currentComment, error: fetchError } = await supabase
        .from('video_comments')
        .select('likes_count')
        .eq('id', commentId)
        .single();

      if (fetchError) throw fetchError;

      const newCount = Math.max(0, (currentComment?.likes_count || 0) - 1);
      
      const { error: updateError } = await supabase
        .from('video_comments')
        .update({ likes_count: newCount })
        .eq('id', commentId);

      if (updateError) throw updateError;

      return { isLiked: false, likesChange: -1, newCount };
    } else {
      // Like - Add to likes table
      const { error: insertError } = await supabase
        .from('video_comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId
        });

      if (insertError) throw insertError;

      // Get current comment and increment likes_count
      const { data: currentComment, error: fetchError } = await supabase
        .from('video_comments')
        .select('likes_count')
        .eq('id', commentId)
        .single();

      if (fetchError) throw fetchError;

      const newCount = (currentComment?.likes_count || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('video_comments')
        .update({ likes_count: newCount })
        .eq('id', commentId);

      if (updateError) throw updateError;

      return { isLiked: true, likesChange: 1, newCount };
    }
  }
};
