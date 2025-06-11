
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    comments: 89
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
    comments: 45
  }
];

const VideoFeed = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos] = useState(mockVideos);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="relative h-screen w-full flex items-center justify-center snap-start bg-black"
        >
          {/* Video Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 text-white z-10">
            
            {/* Top section - could show live indicator or other info */}
            <div className="flex justify-between items-start">
              <div></div>
            </div>

            {/* Bottom section - video info and actions */}
            <div className="flex justify-between items-end">
              
              {/* Video Info */}
              <div className="flex-1 mr-4">
                <h3 className="text-lg font-bold mb-1">{video.title}</h3>
                <p className="text-sm text-gray-200 mb-1">@{video.author}</p>
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">{video.description}</p>
                
                {video.isPromo && (
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Acheter - {video.price}€
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center space-y-4">
                <button className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="text-xs mt-1">{video.likes}</span>
                </button>

                <button className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs mt-1">{video.comments}</span>
                </button>

                <button className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Share className="w-6 h-6" />
                  </div>
                  <span className="text-xs mt-1">Partager</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoFeed;
