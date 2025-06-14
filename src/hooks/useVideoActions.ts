
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useVideoLikes } from '@/hooks/useVideoLikes';

export const useVideoActions = (onLikeUpdate: (videoId: string, isLiked: boolean, newCount: number) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { toggleLike } = useVideoLikes();

  const handleLike = async (videoId: string) => {
    console.log('Attempting to like/unlike video:', videoId);
    
    const likeResult = await toggleLike(videoId);
    console.log('Like result:', likeResult);
    
    if (likeResult !== undefined) {
      onLikeUpdate(videoId, likeResult.isLiked, likeResult.newCount);
      
      toast({
        description: likeResult.isLiked ? "J'aime ajouté!" : "J'aime retiré!",
      });
      
      console.log('Updated video state locally');
    }
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

  return {
    handleLike,
    handleShare,
    handleFeedback,
    handleBuyClick
  };
};
