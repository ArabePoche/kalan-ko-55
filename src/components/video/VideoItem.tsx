
import React, { useState, useEffect } from 'react';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import { useVideoActions } from '@/hooks/useVideoActions';

interface VideoItemProps {
  video: any;
  onLikeUpdate: (videoId: string, isLiked: boolean, newCount: number) => void;
  onBuyClick?: (video: any) => void;
}

const VideoItem = ({ video, onLikeUpdate, onBuyClick }: VideoItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes_count || 0);
  const { handleLike, handleShare } = useVideoActions(onLikeUpdate);

  useEffect(() => {
    setIsLiked(video.isLiked);
    setLikesCount(video.likes_count || 0);
  }, [video.isLiked, video.likes_count]);

  const getAuthorAvatar = () => {
    if (video.author && typeof video.author === 'object') {
      return '/placeholder.svg';
    }
    return '/placeholder.svg';
  };

  const getAuthorName = () => {
    if (video.author && typeof video.author === 'object') {
      const author = video.author as { first_name?: string; last_name?: string; username?: string };
      if (author.first_name || author.last_name) {
        return `${author.first_name || ''} ${author.last_name || ''}`.trim();
      }
      return author.username || 'Auteur';
    }
    return typeof video.author === 'string' ? video.author : 'Auteur';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Video container */}
      <div className="relative aspect-video bg-gray-900">
        <video
          src={video.video_url}
          poster={video.thumbnail_url}
          className="absolute inset-0 w-full h-full object-cover"
          controls
        />
      </div>

      {/* Video info */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img
            src={getAuthorAvatar()}
            alt={getAuthorName()}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
              {video.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span>{getAuthorName()}</span>
              <span className="mx-2">•</span>
              <span>{video.views_count} vues</span>
            </div>
            <p className="text-gray-700 text-sm line-clamp-3">
              {video.description || 'Aucune description disponible.'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => handleLike(video.id)}
              className={`flex items-center space-x-2 text-gray-600 hover:text-primary ${isLiked ? 'text-primary' : ''}`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={() => handleShare(video.id)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary"
            >
              <Share2 className="w-5 h-5" />
              <span>Partager</span>
            </button>
          </div>
          {video.product && onBuyClick && (
            <button
              onClick={() => onBuyClick(video)}
              className="bg-primary text-white rounded-md py-2 px-4 hover:bg-primary/90 flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Acheter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
