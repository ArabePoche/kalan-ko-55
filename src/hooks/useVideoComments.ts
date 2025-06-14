
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { VideoComment } from '@/types/comments';
import { commentService } from '@/services/commentService';

export const useVideoComments = (videoId: string) => {
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!videoId) return;
    
    try {
      setLoading(true);
      const commentsData = await commentService.fetchComments(videoId, user?.id);
      setComments(commentsData);
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
      const newComment = await commentService.addComment(
        videoId, 
        user.id, 
        content, 
        user.user_metadata
      );

      setComments(prevComments => [newComment, ...prevComments]);

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
      const newReply = await commentService.addReply(
        videoId,
        parentCommentId,
        user.id,
        content,
        user.user_metadata
      );

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === parentCommentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newReply]
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
      const result = await commentService.toggleCommentLike(commentId, user.id);

      // Update local state with the actual count from database
      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: result.isLiked,
              likes_count: result.newCount
            };
          }
          
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? {
                      ...reply,
                      isLiked: result.isLiked,
                      likes_count: result.newCount
                    }
                  : reply
              )
            };
          }
          
          return comment;
        })
      );
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

export type { VideoComment } from '@/types/comments';
