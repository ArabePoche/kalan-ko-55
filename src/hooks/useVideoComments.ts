
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
          if (user) {
            const { data: likeData } = await supabase
              .from('video_comment_likes')
              .select('id')
              .eq('comment_id', comment.id)
              .eq('user_id', user.id)
              .maybeSingle();
            
            isLiked = !!likeData;
          }

          // Process replies with like status
          const repliesWithLikes = await Promise.all(
            (repliesData || []).map(async (reply) => {
              let replyIsLiked = false;
              if (user) {
                const { data: replyLikeData } = await supabase
                  .from('video_comment_likes')
                  .select('id')
                  .eq('comment_id', reply.id)
                  .eq('user_id', user.id)
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

      setComments(commentsWithReplies);
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
    if (!user || !content.trim()) return false;

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

  const addReply = async (parentCommentId: string, content: string) => {
    if (!user || !content.trim()) return false;

    try {
      const { data: newReply, error } = await supabase
        .from('video_comments')
        .insert({
          video_id: videoId,
          user_id: user.id,
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

      // Add the new reply to the local state
      const replyWithUser: VideoComment = {
        id: newReply.id,
        content: newReply.content,
        likes_count: 0,
        created_at: newReply.created_at,
        user: {
          id: user.id,
          username: user.user_metadata?.username || 'Vous',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || ''
        },
        isLiked: false,
        replies: []
      };

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === parentCommentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), replyWithUser]
              }
            : comment
        )
      );

      toast({
        description: "Réponse ajoutée avec succès!",
      });

      return true;
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        variant: "destructive",
        description: "Erreur lors de l'ajout de la réponse.",
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

        // Update local state for both comments and replies
        setComments(prevComments =>
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                isLiked: false,
                likes_count: Math.max(0, comment.likes_count - 1)
              };
            }
            
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        isLiked: false,
                        likes_count: Math.max(0, reply.likes_count - 1)
                      }
                    : reply
                )
              };
            }
            
            return comment;
          })
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

        // Update local state for both comments and replies
        setComments(prevComments =>
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                isLiked: true,
                likes_count: comment.likes_count + 1
              };
            }
            
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply.id === commentId
                    ? {
                        ...reply,
                        isLiked: true,
                        likes_count: reply.likes_count + 1
                      }
                    : reply
                )
              };
            }
            
            return comment;
          })
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
    addReply,
    toggleCommentLike,
    refetchComments: fetchComments
  };
};
