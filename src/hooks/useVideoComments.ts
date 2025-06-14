
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export interface VideoComment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  isLiked?: boolean;
  replies?: VideoComment[];
}

export const useVideoComments = (videoId: string) => {
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!videoId) return;
    
    try {
      setLoading(true);
      
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

      // Check which comments are liked by current user
      const commentsWithLikes = await Promise.all(
        (commentsData || []).map(async (comment) => {
          let isLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('video_comment_likes')
              .select('id')
              .eq('comment_id', comment.id)
              .eq('user_id', user.id)
              .maybeSingle();
            
            isLiked = !!likeData;
          }

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
            replies: []
          };
        })
      );

      setComments(commentsWithLikes);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        variant: "destructive",
        description: "Erreur lors du chargement des commentaires.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { data: newComment, error } = await supabase
        .from('video_comments')
        .insert({
          video_id: videoId,
          user_id: user.id,
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

      // Add the new comment to the local state
      const commentWithUser: VideoComment = {
        id: newComment.id,
        content: newComment.content,
        likes_count: 0,
        created_at: newComment.created_at,
        user: {
          id: user.id,
          username: user.user_metadata?.username || 'Vous',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || ''
        },
        isLiked: false,
        replies: []
      };

      setComments(prevComments => [commentWithUser, ...prevComments]);

      toast({
        description: "Commentaire ajouté avec succès!",
      });

      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        description: "Erreur lors de l'ajout du commentaire.",
      });
      return false;
    }
  };

  const toggleCommentLike = async (commentId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Vous devez être connecté pour aimer un commentaire.",
      });
      return;
    }

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('video_comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('video_comment_likes')
          .delete()
          .eq('id', existingLike.id);

        if (error) throw error;

        // Update local state
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLiked: false,
                  likes_count: Math.max(0, comment.likes_count - 1)
                }
              : comment
          )
        );
      } else {
        // Like
        const { error } = await supabase
          .from('video_comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id
          });

        if (error) throw error;

        // Update local state
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLiked: true,
                  likes_count: comment.likes_count + 1
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      toast({
        variant: "destructive",
        description: "Erreur lors de la gestion du like.",
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return {
    comments,
    loading,
    addComment,
    toggleCommentLike,
    refetchComments: fetchComments
  };
};
