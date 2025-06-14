
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Video } from '@/types/video';
import VideoActionButtons from './VideoActionButtons';

interface VideoItemProps {
  video: Video;
  index: number;
  iframeRef: (el: HTMLIFrameElement | null) => void;
  onLike: (videoId: string) => void;
  onComment: (videoId: string) => void;
  onShare: (videoId: string) => void;
  onFeedback: (videoId: string) => void;
  onBuyClick: (videoId: string) => void;
}

const VideoItem = ({
  video,
  index,
  iframeRef,
  onLike,
  onComment,
  onShare,
  onFeedback,
  onBuyClick
}: VideoItemProps) => {
  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYouTubeVideoId(video.video_url);

  return (
    <div className="relative h-screen w-full snap-start bg-black overflow-hidden">
      {/* Video Background - Vertical Format */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[400px] mx-auto">
          {youtubeId ? (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&mute=0&controls=0&loop=1&playlist=${youtubeId}&rel=0&showinfo=0&modestbranding=1`}
              className="w-full h-full object-cover rounded-lg"
              allow="autoplay; encrypted-media"
              allowFullScreen
              frameBorder="0"
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
                onClick={() => onBuyClick(video.id)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Voir la formation - {video.product.price}€
              </Button>
            )}
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <VideoActionButtons
          video={video}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onFeedback={onFeedback}
        />
      </div>
    </div>
  );
};

export default VideoItem;
