
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';

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
        .maybeSingle();

      if (existingLike) {
        // Unlike the video
        const { error: deleteError } = await supabase
          .from('video_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);

        if (deleteError) throw deleteError;

        // Decrement likes count with proper error handling
        const { data: currentVideo, error: fetchError } = await supabase
          .from('videos')
          .select('likes_count')
          .eq('id', videoId)
          .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
          .from('videos')
          .update({ likes_count: Math.max(0, (currentVideo?.likes_count || 0) - 1) })
          .eq('id', videoId);

        if (updateError) throw updateError;

        return { 
          isLiked: false, 
          newCount: Math.max(0, (currentVideo?.likes_count || 0) - 1) 
        };
      } else {
        // Like the video
        const { error: insertError } = await supabase
          .from('video_likes')
          .insert({ user_id: user.id, video_id: videoId });

        if (insertError) throw insertError;

        // Increment likes count with proper error handling
        const { data: currentVideo, error: fetchError } = await supabase
          .from('videos')
          .select('likes_count')
          .eq('id', videoId)
          .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
          .from('videos')
          .update({ likes_count: (currentVideo?.likes_count || 0) + 1 })
          .eq('id', videoId);

        if (updateError) throw updateError;

        return { 
          isLiked: true, 
          newCount: (currentVideo?.likes_count || 0) + 1 
        };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        variant: "destructive",
        description: "Erreur lors de la gestion du like.",
      });
      return undefined;
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
        .maybeSingle();

      return !!data;
    } catch {
      return false;
    }
  };

  return { toggleLike, checkIfLiked };
};
