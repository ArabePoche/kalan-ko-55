
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { VideoFeedbackModal } from '../feedback/VideoFeedbackModal';

interface VideoFeedbackButtonProps {
  videoId: string;
  videoTitle: string;
  className?: string;
}

export const VideoFeedbackButton = ({ videoId, videoTitle, className }: VideoFeedbackButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
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
