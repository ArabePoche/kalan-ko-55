
import React, { useState } from 'react';
import { X, Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  text: string;
  likes: number;
  isLiked: boolean;
  timestamp: string;
}

interface VideoCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const VideoComments: React.FC<VideoCommentsProps> = ({ isOpen, onClose, videoId }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        username: 'user1',
        avatar: '/placeholder.svg'
      },
      text: 'Super vidéo ! 🔥',
      likes: 5,
      isLiked: false,
      timestamp: '2h'
    },
    {
      id: '2',
      user: {
        username: 'user2',
        avatar: '/placeholder.svg'
      },
      text: 'Merci pour ce contenu de qualité',
      likes: 12,
      isLiked: true,
      timestamp: '4h'
    }
  ]);

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          username: 'vous',
          avatar: '/placeholder.svg'
        },
        text: newComment,
        likes: 0,
        isLiked: false,
        timestamp: 'maintenant'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const toggleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full h-[70vh] rounded-t-3xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold">{comments.length} commentaires</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold">
                    {comment.user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {comment.user.username}
                    </span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-900 mt-1">{comment.text}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button 
                      className="flex items-center space-x-1 text-xs text-gray-500"
                      onClick={() => toggleCommentLike(comment.id)}
                    >
                      <Heart 
                        className={`w-3 h-3 ${comment.isLiked ? 'text-red-500 fill-current' : ''}`} 
                      />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-xs text-gray-500">Répondre</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Comment Input */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">V</span>
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1 border-none bg-white rounded-full px-4 py-2"
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
              />
              <Button
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className="rounded-full w-8 h-8 p-0 bg-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoComments;
