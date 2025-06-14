
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useVideoLikes } from '@/hooks/useVideoLikes';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { Video } from '@/types/video';
import VideoItem from './video/VideoItem';
import VideoComments from './VideoComments';

const VideoFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { toggleLike, checkIfLiked } = useVideoLikes();
  const { iframeRefs, updateVideoPlayback } = useVideoPlayback(currentVideoIndex, videos);

  useEffect(() => {
    fetchVideos();
  }, []);

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
          return {
            id: video.id,
            title: video.title,
            description: video.description || '',
            video_url: video.video_url || '',
            thumbnail_url: video.thumbnail_url || '/placeholder.svg',
            video_type: video.video_type,
            likes_count: video.likes_count || 0,
            comments_count: video.comments_count || 0,
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

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      
      if (newIndex !== currentVideoIndex) {
        setCurrentVideoIndex(newIndex);
        updateVideoPlayback(newIndex);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentVideoIndex]);

  const handleLike = async (videoId: string) => {
    const newLikedState = await toggleLike(videoId);
    if (newLikedState !== undefined) {
      // Refetch the updated video data to get the correct like count
      const { data: updatedVideo } = await supabase
        .from('videos')
        .select('likes_count')
        .eq('id', videoId)
        .single();

      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                isLiked: newLikedState,
                likes_count: updatedVideo?.likes_count || video.likes_count
              }
            : video
        )
      );
      
      toast({
        description: newLikedState ? "J'aime ajouté!" : "J'aime retiré!",
      });
    }
  };

  const handleComment = (videoId: string) => {
    setCurrentVideoId(videoId);
    setCommentsOpen(true);
  };

  const handleShare = (videoId: string) => {
    console.log('Partage de la vidéo:', videoId);
    if (navigator.share) {
      navigator.share({
        title: 'Regardez cette vidéo',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        description: "Lien copié dans le presse-papiers!",
      });
    }
  };

  const handleFeedback = (videoId: string) => {
    console.log('Feedback pour la vidéo:', videoId);
    navigate('/admin/feedback');
  };

  const handleBuyClick = (videoId: string) => {
    navigate(`/formation/${videoId}`);
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Chargement des vidéos...</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg">Aucune vidéo disponible</p>
          <p className="text-sm text-gray-400">Revenez plus tard pour du nouveau contenu!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        
        {videos.map((video, index) => (
          <VideoItem
            key={video.id}
            video={video}
            index={index}
            iframeRef={(el) => (iframeRefs.current[index] = el)}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onFeedback={handleFeedback}
            onBuyClick={handleBuyClick}
          />
        ))}
      </div>

      {/* Comments Modal */}
      <VideoComments 
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        videoId={currentVideoId}
      />
    </>
  );
};

export default VideoFeed;
