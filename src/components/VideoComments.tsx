
import React, { useState } from 'react';
import { X, Send, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVideoComments } from '@/hooks/useVideoComments';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VideoCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const VideoComments: React.FC<VideoCommentsProps> = ({ isOpen, onClose, videoId }) => {
  const [newComment, setNewComment] = useState('');
  const { comments, loading, addComment, toggleCommentLike } = useVideoComments(videoId);

  const handleSendComment = async () => {
    if (newComment.trim()) {
      const success = await addComment(newComment);
      if (success) {
        setNewComment('');
      }
    }
  };

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

  const getDisplayName = (comment: any) => {
    if (comment.user.username) return `@${comment.user.username}`;
    if (comment.user.first_name || comment.user.last_name) {
      return `${comment.user.first_name || ''} ${comment.user.last_name || ''}`.trim();
    }
    return 'Utilisateur';
  };

  const getInitials = (comment: any) => {
    if (comment.user.first_name) return comment.user.first_name.charAt(0).toUpperCase();
    if (comment.user.username) return comment.user.username.charAt(0).toUpperCase();
    return 'U';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full h-[70vh] rounded-t-3xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold">
              {loading ? 'Chargement...' : `${comments.length} commentaires`}
            </span>
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Chargement des commentaires...</div>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucun commentaire pour le moment</p>
                <p className="text-sm">Soyez le premier à commenter!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
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
                        onClick={() => toggleCommentLike(comment.id)}
                      >
                        <Heart 
                          className={`w-3 h-3 ${comment.isLiked ? 'text-red-500 fill-current' : ''}`} 
                        />
                        <span>{comment.likes_count}</span>
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                        Répondre
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                maxLength={500}
              />
              <Button
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className="rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
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
