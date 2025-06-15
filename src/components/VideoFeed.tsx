import { useState, useRef, useEffect } from 'react';
import { useVideoPlayback } from '@/hooks/useVideoPlayback';
import { useVideoFeed } from '@/hooks/useVideoFeed';
import { useVideoActions } from '@/hooks/useVideoActions';
import VideoItem from './video/VideoItem';
import VideoComments from './VideoComments';
import VideoFeedTabs from './video/VideoFeedTabs';
import PostsFeed from './PostsFeed';

const VideoFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('videos');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { videos, loading, updateVideoLike, updateVideoCommentCount, updateVideoViews } = useVideoFeed();
  const { iframeRefs, updateVideoPlayback } = useVideoPlayback(currentVideoIndex, videos);
  const { handleLike, handleShare, handleBuyClick } = useVideoActions(updateVideoLike);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      
      if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
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
  }, [currentVideoIndex, videos]);

  const handleComment = (videoId: string) => {
    setCurrentVideoId(videoId);
    setCommentsOpen(true);
  };

  const handleCommentAdded = () => {
    updateVideoCommentCount(currentVideoId);
  };

  const handleViewCountIncrement = (videoId: string) => {
    updateVideoViews(videoId);
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
      {/* Navigation par onglets transparents */}
      <VideoFeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenu en fonction de l'onglet actif */}
      {activeTab === 'videos' ? (
        <div 
          ref={containerRef}
          className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
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
              onLikeUpdate={updateVideoLike}
              onBuyClick={handleBuyClick}
            />
          ))}
        </div>
      ) : (
        <div className="h-screen bg-black" style={{ scrollBehavior: 'smooth' }}>
          <PostsFeed />
        </div>
      )}

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
