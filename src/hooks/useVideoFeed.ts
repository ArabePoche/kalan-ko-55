
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useVideoLikes } from '@/hooks/useVideoLikes';
import { videoService } from '@/services/videoService';
import { videoViewService } from '@/services/videoViewService';
import { Video } from '@/types/video';

export const useVideoFeed = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewedVideos, setViewedVideos] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { checkIfLiked } = useVideoLikes();

  const fetchVideos = async () => {
    try {
      const { data: videosData, error } = await supabase
        .from('videos')
        .select(`
          *,
          author:profiles!videos_author_id_fkey(id, first_name, last_name, username),
          product:products!videos_product_id_fkey(id, price)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const videosWithLikes = await Promise.all(
        (videosData || []).map(async (video) => {
          const isLiked = await checkIfLiked(video.id);
          
          // Sync comments count to ensure it's accurate
          let commentsCount = video.comments_count || 0;
          try {
            commentsCount = await videoService.syncCommentsCount(video.id);
          } catch (error) {
            console.error('Error syncing comments count for video:', video.id, error);
          }
          
          // Sync likes count to ensure it's accurate
          let likesCount = video.likes_count || 0;
          try {
            likesCount = await videoService.syncLikesCount(video.id);
          } catch (error) {
            console.error('Error syncing likes count for video:', video.id, error);
          }
          
          return {
            id: video.id,
            title: video.title,
            description: video.description || '',
            video_url: video.video_url || '',
            thumbnail_url: video.thumbnail_url || '/placeholder.svg',
            video_type: video.video_type,
            likes_count: likesCount,
            comments_count: commentsCount,
            views_count: video.views_count || 0,
            author: {
              id: video.author?.id || '',
              first_name: video.author?.first_name || 'Utilisateur',
              last_name: video.author?.last_name || '',
              username: video.author?.username || 'user'
            },
            product: video.product ? {
              id: video.product.id,
              price: video.product.price
            } : undefined,
            isLiked
          };
        })
      );

      setVideos(videosWithLikes);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        variant: "destructive",
        description: "Erreur lors du chargement des vidéos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVideoLike = (videoId: string, isLiked: boolean, newCount: number) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              isLiked,
              likes_count: newCount
            }
          : video
      )
    );
  };

  const updateVideoCommentCount = (videoId: string) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              comments_count: video.comments_count + 1
            }
          : video
      )
    );
  };

  const updateVideoViews = async (videoId: string) => {
    // Only increment view if this video hasn't been viewed in this session
    if (viewedVideos.has(videoId)) {
      return;
    }

    const newViewCount = await videoViewService.incrementView(videoId);
    
    if (newViewCount !== null) {
      // Mark video as viewed
      setViewedVideos(prev => new Set([...prev, videoId]));
      
      // Update local state
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                views_count: newViewCount
              }
            : video
        )
      );
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    updateVideoLike,
    updateVideoCommentCount,
    updateVideoViews,
    refetchVideos: fetchVideos
  };
};
