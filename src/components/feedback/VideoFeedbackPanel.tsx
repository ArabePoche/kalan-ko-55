
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { VideoFeedbackModal } from './VideoFeedbackModal';

interface VideoFeedbackPanelProps {
  videoId: string;
  videoTitle: string;
}

export const VideoFeedbackPanel = ({ videoId, videoTitle }: VideoFeedbackPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Voir les feedbacks
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
