
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
        // Unlike the video
        const { error: deleteError } = await supabase
          .from('video_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);

        if (deleteError) {
          console.error('Error deleting like:', deleteError);
          throw deleteError;
        }

        // Get current likes count and decrement
        const { data: currentVideo, error: fetchError } = await supabase
          .from('videos')
          .select('likes_count')
          .eq('id', videoId)
          .single();

        if (fetchError) {
          console.error('Error fetching video for decrement:', fetchError);
          throw fetchError;
        }

        const newCount = Math.max(0, (currentVideo?.likes_count || 0) - 1);
        
        const { error: updateError } = await supabase
          .from('videos')
          .update({ likes_count: newCount })
          .eq('id', videoId);

        if (updateError) {
          console.error('Error updating likes count (decrement):', updateError);
          throw updateError;
        }

        console.log('Like removed successfully, new count:', newCount);
        return { 
          isLiked: false, 
          newCount: newCount
        };
      } else {
        console.log('Adding like...');
        // Like the video
        const { error: insertError } = await supabase
          .from('video_likes')
          .insert({ user_id: user.id, video_id: videoId });

        if (insertError) {
          console.error('Error inserting like:', insertError);
          throw insertError;
        }

        // Get current likes count and increment
        const { data: currentVideo, error: fetchError } = await supabase
          .from('videos')
          .select('likes_count')
          .eq('id', videoId)
          .single();

        if (fetchError) {
          console.error('Error fetching video for increment:', fetchError);
          throw fetchError;
        }

        const newCount = (currentVideo?.likes_count || 0) + 1;
        
        const { error: updateError } = await supabase
          .from('videos')
          .update({ likes_count: newCount })
          .eq('id', videoId);

        if (updateError) {
          console.error('Error updating likes count (increment):', updateError);
          throw updateError;
        }

        console.log('Like added successfully, new count:', newCount);
        return { 
          isLiked: true, 
          newCount: newCount
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
