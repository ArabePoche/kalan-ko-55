
import { Heart, MessageCircle, Share, Users } from 'lucide-react';
import { Video } from '@/types/video';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface VideoActionButtonsProps {
  video: Video;
  onLike: (videoId: string) => void;
  onComment: (videoId: string) => void;
  onShare: (videoId: string) => void;
}

const VideoActionButtons = ({ 
  video, 
  onLike, 
  onComment, 
  onShare, 
}: VideoActionButtonsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAction = (action: (videoId: string) => void) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer cette action.",
      });
      navigate('/auth');
    } else {
      action(video.id);
    }
  };

  return (
    <div className="w-16 flex flex-col justify-end items-center pb-20 space-y-6 z-10">
      <button 
        className="flex flex-col items-center"
        onClick={() => handleAction(onLike)}
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
        onClick={() => handleAction(onComment)}
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
        onClick={() => handleAction(onShare)}
      >
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Share className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs text-white mt-1 font-medium">Share</span>
      </button>
    </div>
  );
};

export default VideoActionButtons;
