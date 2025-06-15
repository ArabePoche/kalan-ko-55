
import React, { forwardRef } from 'react';
import { Heart, MessageCircle, Share2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video } from '@/types/video';
import { useVideoViewTracking } from '@/hooks/useVideoViewTracking';
import { getEmbedUrl } from '@/utils/videoUtils';

interface VideoItemProps {
  video: Video;
  index: number;
  currentVideoIndex: number;
  iframeRef: (el: HTMLIFrameElement | null) => void;
  onLike: (videoId: string) => void;
  onComment: (videoId: string) => void;
  onShare: (videoId: string) => void;
  onBuyClick: (video: Video) => void;
  onViewCountIncrement: (videoId: string) => void;
}

const VideoItem = forwardRef<HTMLDivElement, VideoItemProps>(({
  video,
  index,
  currentVideoIndex,
  iframeRef,
  onLike,
  onComment,
  onShare,
  onBuyClick,
  onViewCountIncrement
}, ref) => {
  const isCurrentVideo = index === currentVideoIndex;
  
  // Track view time and increment count after 10 seconds
  useVideoViewTracking(video.id, isCurrentVideo, onViewCountIncrement);
  
  const embedUrl = getEmbedUrl(video.video_url);

  const handleLike = () => onLike(video.id);
  const handleComment = () => onComment(video.id);
  const handleShare = () => onShare(video.id);
  const handleBuy = () => onBuyClick(video);

  return (
    <div 
      ref={ref}
      className="relative h-screen w-full snap-start flex items-center justify-center bg-black overflow-hidden"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Video - Plein écran vertical */}
      <div className="absolute inset-0 w-full h-full">
        {embedUrl ? (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="w-full h-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <p className="text-white text-lg">Vidéo non disponible</p>
          </div>
        )}
      </div>

      {/* Overlay avec informations - Position TikTok */}
      <div className="absolute inset-0 flex">
        {/* Côté gauche - Informations vidéo */}
        <div className="flex-1 flex items-end p-4">
          <div className="max-w-xs">
            <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2">
              {video.title}
            </h3>
            
            {video.description && (
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>
            )}

            {/* Bouton d'achat si disponible */}
            {video.product && (
              <Button
                onClick={handleBuy}
                className="bg-green-600 hover:bg-green-700 text-white mb-3 px-4 py-2 rounded-full"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Acheter - {video.product.price}€
              </Button>
            )}

            {/* Stats - Vues uniquement */}
            <div className="flex items-center space-x-4 text-white text-sm">
              <span>{video.views_count || 0} vues</span>
            </div>
          </div>
        </div>

        {/* Côté droit - Boutons d'action (style TikTok) */}
        <div className="w-16 flex flex-col justify-end items-center pb-24 space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="text-white hover:bg-white/20 flex-col h-auto py-3 px-3"
          >
            <Heart 
              className={`w-8 h-8 mb-1 ${video.isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
            />
            <span className="text-xs">{video.likes_count || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleComment}
            className="text-white hover:bg-white/20 flex-col h-auto py-3 px-3"
          >
            <MessageCircle className="w-8 h-8 mb-1" />
            <span className="text-xs">{video.comments_count || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-white hover:bg-white/20 flex-col h-auto py-3 px-3"
          >
            <Share2 className="w-8 h-8 mb-1" />
            <span className="text-xs">Partager</span>
          </Button>
        </div>
      </div>

      {/* Badge type de vidéo */}
      {video.video_type && (
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-black/50 text-white">
            {video.video_type === 'educational' ? 'Éducatif' : 
             video.video_type === 'promo' ? 'Promotionnel' : 
             video.video_type === 'testimonial' ? 'Témoignage' :
             video.video_type}
          </Badge>
        </div>
      )}
    </div>
  );
});

VideoItem.displayName = 'VideoItem';

export default VideoItem;
