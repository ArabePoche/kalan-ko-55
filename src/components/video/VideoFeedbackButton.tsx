
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { VideoFeedbackModal } from '../feedback/VideoFeedbackModal';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface VideoFeedbackButtonProps {
  videoId: string;
  videoTitle: string;
  className?: string;
}

export const VideoFeedbackButton = ({ videoId, videoTitle, className }: VideoFeedbackButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour donner votre avis.",
      });
      navigate('/auth');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={`text-white hover:bg-white/20 ${className}`}
      >
        <MessageSquare className="w-5 h-5" />
      </Button>

      <VideoFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId={videoId}
        videoTitle={videoTitle}
      />
    </>
  );
};
