
import React, { useState } from 'react';
import { X, Send, Heart, MessageCircle, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const { comments, loading, addComment, addReply, toggleCommentLike } = useVideoComments(videoId);

  const handleSendComment = async () => {
    if (newComment.trim()) {
      const success = await addComment(newComment);
      if (success) {
        setNewComment('');
      }
    }
  };

  const handleSendReply = async (parentCommentId: string) => {
    if (replyText.trim()) {
      const success = await addReply(parentCommentId, replyText);
      if (success) {
        setReplyText('');
        setReplyingTo(null);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleReplyKeyPress = (e: React.KeyboardEvent, parentCommentId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply(parentCommentId);
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
      <div className="bg-white w-full h-[85vh] rounded-t-3xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-3xl">
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
        <ScrollArea className="flex-1 p-4 pb-0">
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
            <div className="space-y-4 pb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Main Comment */}
                  <div className="flex space-x-3">
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
                          <span>{comment.likes_count || 0}</span>
                        </button>
                        <button 
                          className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        >
                          <Reply className="w-3 h-3" />
                          <span>Répondre</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="ml-11 mt-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">V</span>
                        </div>
                        <div className="flex-1">
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyPress={(e) => handleReplyKeyPress(e, comment.id)}
                            placeholder="Écrivez votre réponse..."
                            className="min-h-[50px] resize-none border-gray-200 focus:border-primary text-sm"
                            maxLength={500}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {replyText.length}/500
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                                className="text-xs"
                              >
                                Annuler
                              </Button>
                              <Button
                                onClick={() => handleSendReply(comment.id)}
                                disabled={!replyText.trim()}
                                size="sm"
                                className="text-xs px-3"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Répondre
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-11 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold">
                              {getInitials(reply)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {getDisplayName(reply)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(reply.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 mt-1">{reply.content}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <button 
                                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                                onClick={() => toggleCommentLike(reply.id)}
                              >
                                <Heart 
                                  className={`w-3 h-3 ${reply.isLiked ? 'text-red-500 fill-current' : ''}`} 
                                />
                                <span>{reply.likes_count || 0}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Comment Input - Fixed at bottom with proper safe area */}
        <div className="p-4 border-t bg-white mt-auto">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">V</span>
            </div>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre commentaire..."
                className="min-h-[60px] resize-none border-gray-200 focus:border-primary"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {newComment.length}/500
                </span>
                <Button
                  onClick={handleSendComment}
                  disabled={!newComment.trim()}
                  size="sm"
                  className="px-4"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Publier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoComments;
