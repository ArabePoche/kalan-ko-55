import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const useVideoLikes = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleLike = async (videoId: string) => {
    console.log('toggleLike called with videoId:', videoId, 'user:', user?.id);
    
    if (!user) {
      toast({
        variant: "destructive",
        description: "Vous devez être connecté pour aimer une vidéo.",
      });
      return;
    }

    try {
      // Check if user already liked this video
      const { data: existingLike, error: checkError } = await supabase
        .from('video_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing like:', checkError);
        throw checkError;
      }

      console.log('Existing like check result:', existingLike);

      if (existingLike) {
        console.log('Removing like...');
        // Unlike the video : delete like and DECREMENT likes_count only if it's > 0 nativement.
        const { error: deleteError } = await supabase
          .from('video_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);

        if (deleteError) throw deleteError;

        // Always fetch the real current like count after trigger (in case other users like at same time)
        const { data: currentVideo, error: fetchError } = await supabase
          .from('videos')
          .select('likes_count')
          .eq('id', videoId)
          .single();

        if (fetchError) throw fetchError;

        // Just return new count from db...
        const newCount = currentVideo?.likes_count || 0;

        return { 
          isLiked: false, 
          newCount
        };
      } else {
        console.log('Adding like...');
        // Like the video
        const { error: insertError } = await supabase
          .from('video_likes')
          .insert({ user_id: user.id, video_id: videoId });

        if (insertError) throw insertError;

        // Always fetch the updated like count from db
        const { data: currentVideo, error: fetchError } = await supabase
          .from('videos')
          .select('likes_count')
          .eq('id', videoId)
          .single();

        if (fetchError) throw fetchError;

        const newCount = currentVideo?.likes_count || 1;

        return { 
          isLiked: true, 
          newCount
        };
      }
    } catch (error) {
      console.error('Error in toggleLike:', error);
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
      const { data, error } = await supabase
        .from('video_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .maybeSingle();

      if (error) {
        console.error('Error checking if liked:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkIfLiked:', error);
      return false;
    }
  };

  return { toggleLike, checkIfLiked };
};
