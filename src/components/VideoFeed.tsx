
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share, ShoppingCart, Flag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  author: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  isPromo: boolean;
  price?: number;
  likes: number;
  comments: number;
  students: number;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Formation Coran - Niveau Débutant',
    author: 'Professeur Ahmed',
    description: 'Apprenez les bases de la lecture du Coran avec cette formation complète.',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnail: '/placeholder.svg',
    isPromo: true,
    price: 49.99,
    likes: 1234,
    comments: 89,
    students: 245
  },
  {
    id: '2',
    title: 'Les bienfaits de la science',
    author: 'Dr. Fatima',
    description: 'Découvrez comment la science nous aide à mieux comprendre le monde.',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnail: '/placeholder.svg',
    isPromo: false,
    likes: 856,
    comments: 45,
    students: 189
  }
];

const VideoFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos] = useState(mockVideos);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      setCurrentVideoIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleFeedback = (videoId: string) => {
    console.log('Feedback pour la vidéo:', videoId);
    navigate('/admin/feedback');
  };

  const handleBuyClick = (videoId: string) => {
    navigate(`/formation/${videoId}`);
  };

  return (
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
        <div
          key={video.id}
          className="relative h-screen w-full snap-start bg-black overflow-hidden"
        >
          {/* Video Background - Vertical Format */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-[400px] mx-auto">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover rounded-lg"
              />
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
                    <span className="text-sm font-bold">{video.author.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium">@{video.author}</span>
                </div>
                
                <h3 className="text-lg font-bold leading-tight">{video.title}</h3>
                <p className="text-sm text-gray-200 line-clamp-2">{video.description}</p>
                
                {video.isPromo && (
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 w-fit"
                    size="sm"
                    onClick={() => handleBuyClick(video.id)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Voir la formation - {video.price}€
                  </Button>
                )}
              </div>
            </div>

            {/* Right side - Action Buttons */}
            <div className="w-16 flex flex-col justify-end items-center pb-20 space-y-6 z-10">
              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">
                  {video.likes > 999 ? `${(video.likes/1000).toFixed(1)}k` : video.likes}
                </span>
              </button>

              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">{video.comments}</span>
              </button>

              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">{video.students}</span>
              </button>

              <button 
                className="flex flex-col items-center"
                onClick={() => handleFeedback(video.id)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">Report</span>
              </button>

              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Share className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
