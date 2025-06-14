
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/components/ui/use-toast';

export const useVideoLikes = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleLike = async (videoId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Vous devez être connecté pour aimer une vidéo.",
      });
      return;
    }

    try {
      // Check if user already liked this video
      const { data: existingLike } = await supabase
        .from('video_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .single();

      if (existingLike) {
        // Unlike the video
        await supabase
          .from('video_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);

        // Decrement likes count
        await supabase
          .from('videos')
          .update({ likes_count: supabase.rpc('decrement_likes_count', { video_id: videoId }) })
          .eq('id', videoId);
      } else {
        // Like the video
        await supabase
          .from('video_likes')
          .insert({ user_id: user.id, video_id: videoId });

        // Increment likes count
        await supabase
          .from('videos')
          .update({ likes_count: supabase.rpc('increment_likes_count', { video_id: videoId }) })
          .eq('id', videoId);
      }

      return !existingLike;
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        variant: "destructive",
        description: "Erreur lors de la gestion du like.",
      });
    }
  };

  const checkIfLiked = async (videoId: string) => {
    if (!user) return false;

    try {
      const { data } = await supabase
        .from('video_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  };

  return { toggleLike, checkIfLiked };
};
