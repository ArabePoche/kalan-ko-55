
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
    const currentUrl = `${window.location.origin}/?video=${videoId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Regardez cette vidéo',
        url: currentUrl,
      }).then(() => {
        toast({
          description: "Vidéo partagée avec succès!",
        });
      }).catch((error) => {
        console.error('Erreur lors du partage:', error);
        // Fallback to clipboard
        navigator.clipboard.writeText(currentUrl);
        toast({
          description: "Lien copié dans le presse-papiers!",
        });
      });
    } else {
      // Fallback to clipboard if Web Share API is not available
      navigator.clipboard.writeText(currentUrl).then(() => {
        toast({
          description: "Lien copié dans le presse-papiers!",
        });
      }).catch((error) => {
        console.error('Erreur lors de la copie:', error);
        toast({
          variant: "destructive",
          description: "Erreur lors de la copie du lien.",
        });
      });
    }
  };

  const handleFeedback = (videoId: string) => {
    console.log('Feedback pour la vidéo:', videoId);
    navigate('/admin/feedback');
  };

  const handleBuyClick = (video: any) => {
    navigate(`/formation/${video.id}`);
  };

  return {
    handleLike,
    handleShare,
    handleFeedback,
    handleBuyClick
  };
};
