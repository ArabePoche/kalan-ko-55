
import React from 'react';
import { Heart, Reply } from 'lucide-react';
import { VideoComment } from '@/types/comments';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CommentItemProps {
  comment: VideoComment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string) => void;
  isReply?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike,
  onReply,
  isReply = false
}) => {
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: fr 
      });
    } catch {
      return 'maintenant';
    }
  };

  const getDisplayName = (comment: VideoComment) => {
    if (comment.user.username) return `@${comment.user.username}`;
    if (comment.user.first_name || comment.user.last_name) {
      return `${comment.user.first_name || ''} ${comment.user.last_name || ''}`.trim();
    }
    return 'Utilisateur';
  };

  const getInitials = (comment: VideoComment) => {
    if (comment.user.first_name) return comment.user.first_name.charAt(0).toUpperCase();
    if (comment.user.username) return comment.user.username.charAt(0).toUpperCase();
    return 'U';
  };

  const avatarSize = isReply ? 'w-6 h-6' : 'w-8 h-8';
  const iconSize = isReply ? 'w-3 h-3' : 'w-3 h-3';

  return (
    <div className="flex space-x-3">
      <div className={`${avatarSize} bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-xs font-bold">
          {getInitials(comment)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-900">
            {getDisplayName(comment)}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimeAgo(comment.created_at)}
          </span>
        </div>
        <p className="text-sm text-gray-900 mt-1">{comment.content}</p>
        <div className="flex items-center space-x-4 mt-2">
          <button 
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            onClick={() => onLike(comment.id)}
          >
            <Heart 
              className={`${iconSize} ${comment.isLiked ? 'text-red-500 fill-current' : ''}`} 
            />
            <span>{comment.likes_count || 0}</span>
          </button>
          {!isReply && (
            <button 
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
              onClick={() => onReply(comment.id)}
            >
              <Reply className={iconSize} />
              <span>Répondre</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
