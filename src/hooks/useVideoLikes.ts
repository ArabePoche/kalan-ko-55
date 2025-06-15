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

      let isLiked: boolean;

      if (existingLike) {
        console.log('Removing like...');
        // Unlike the video
        const { error: deleteError } = await supabase
          .from('video_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);
        if (deleteError) throw deleteError;
        isLiked = false;
      } else {
        console.log('Adding like...');
        // Like the video
        const { error: insertError } = await supabase
          .from('video_likes')
          .insert({ user_id: user.id, video_id: videoId });
        if (insertError) throw insertError;
        isLiked = true;
      }

      // Get the new count of likes for the video
      const { count, error: countError } = await supabase
        .from('video_likes')
        .select('*', { count: 'exact', head: true })
        .eq('video_id', videoId);

      if (countError) throw countError;

      const newCount = count || 0;

      // Update the likes_count in the videos table
      const { error: updateError } = await supabase
        .from('videos')
        .update({ likes_count: newCount })
        .eq('id', videoId);

      if (updateError) throw updateError;
      
      return { isLiked, newCount };

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
