
import { useState, useRef, useEffect } from 'react';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { useVideoFeed } from '@/hooks/useVideoFeed';
import { useVideoActions } from '@/hooks/useVideoActions';
import VideoItem from './video/VideoItem';
import VideoComments from './VideoComments';

const VideoFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { videos, loading, updateVideoLike, updateVideoCommentCount } = useVideoFeed();
  const { iframeRefs, updateVideoPlayback } = useVideoPlayback(currentVideoIndex, videos);
  const { handleLike, handleShare, handleBuyClick } = useVideoActions(updateVideoLike);

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

  const handleComment = (videoId: string) => {
    setCurrentVideoId(videoId);
    setCommentsOpen(true);
  };

  const handleFeedback = (videoId: string) => {
    // Cette fonction peut rester simple car le feedback est géré directement dans VideoItem
    console.log('Feedback pour la vidéo:', videoId);
  };

  const handleCommentAdded = () => {
    updateVideoCommentCount(currentVideoId);
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
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
};

export default VideoFeed;
