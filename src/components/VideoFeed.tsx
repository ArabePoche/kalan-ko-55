
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share, ShoppingCart, Flag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useVideoLikes } from '@/hooks/useVideoLikes';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  video_type: 'promo' | 'educational' | 'testimonial';
  likes_count: number;
  comments_count: number;
  views_count: number;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
  };
  product?: {
    id: string;
    price: number;
  };
  isLiked?: boolean;
}

const VideoFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { toggleLike, checkIfLiked } = useVideoLikes();

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
      setCurrentVideoIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleLike = async (videoId: string) => {
    const newLikedState = await toggleLike(videoId);
    if (newLikedState !== undefined) {
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                isLiked: newLikedState,
                likes_count: newLikedState ? video.likes_count + 1 : video.likes_count - 1
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
    console.log('Commentaire pour la vidéo:', videoId);
    toast({
      description: "Fonctionnalité de commentaires bientôt disponible!",
    });
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
        <div
          key={video.id}
          className="relative h-screen w-full snap-start bg-black overflow-hidden"
        >
          {/* Video Background - Vertical Format */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-[400px] mx-auto">
              {video.video_url ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.video_url.split('/').pop()?.split('?')[0]}?autoplay=${index === currentVideoIndex ? 1 : 0}&mute=1&controls=0&loop=1&playlist=${video.video_url.split('/').pop()?.split('?')[0]}`}
                  className="w-full h-full object-cover rounded-lg"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 rounded-lg" />
            </div>
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex">
            
            {/* Left side - Video info */}
            <div className="flex-1 flex flex-col justify-end p-4 pb-20 text-white z-10 max-w-[calc(100%-80px)]">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {video.author.first_name?.charAt(0) || video.author.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    @{video.author.username || `${video.author.first_name} ${video.author.last_name}`.trim()}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold leading-tight">{video.title}</h3>
                <p className="text-sm text-gray-200 line-clamp-2">{video.description}</p>
                
                {video.video_type === 'promo' && video.product && (
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 w-fit"
                    size="sm"
                    onClick={() => handleBuyClick(video.id)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Voir la formation - {video.product.price}€
                  </Button>
                )}
              </div>
            </div>

            {/* Right side - Action Buttons */}
            <div className="w-16 flex flex-col justify-end items-center pb-20 space-y-6 z-10">
              <button 
                className="flex flex-col items-center"
                onClick={() => handleLike(video.id)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Heart className={`w-6 h-6 ${video.isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
                </div>
                <span className="text-xs text-white mt-1 font-medium">
                  {video.likes_count > 999 ? `${(video.likes_count/1000).toFixed(1)}k` : video.likes_count}
                </span>
              </button>

              <button 
                className="flex flex-col items-center"
                onClick={() => handleComment(video.id)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">{video.comments_count}</span>
              </button>

              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">{video.views_count}</span>
              </button>

              <button 
                className="flex flex-col items-center"
                onClick={() => handleFeedback(video.id)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">Report</span>
              </button>

              <button 
                className="flex flex-col items-center"
                onClick={() => handleShare(video.id)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Share className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
