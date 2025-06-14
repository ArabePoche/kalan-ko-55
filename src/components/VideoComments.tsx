import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVideoComments } from '@/hooks/useVideoComments';
import { CommentsHeader } from './video-comments/CommentsHeader';
import { CommentsList } from './video-comments/CommentsList';
import { CommentInput } from './video-comments/CommentInput';

interface VideoCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  onCommentAdded?: () => void;
}

const VideoComments: React.FC<VideoCommentsProps> = ({ 
  isOpen, 
  onClose, 
  videoId, 
  onCommentAdded 
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const { comments, loading, addComment, addReply, toggleCommentLike } = useVideoComments(videoId);

  const handleSendComment = async () => {
    if (newComment.trim()) {
      const success = await addComment(newComment);
      if (success) {
        setNewComment('');
        // Call the callback to update the parent component's state
        onCommentAdded?.();
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

  const handleStartReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    if (replyingTo !== commentId) {
      setReplyText('');
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full h-[80vh] rounded-t-3xl flex flex-col">
        {/* Header */}
        <CommentsHeader
          loading={loading}
          commentsCount={comments.length}
          onClose={onClose}
        />

        {/* Comments List */}
        <ScrollArea className="flex-1 p-4 pb-0">
          <CommentsList
            comments={comments}
            loading={loading}
            replyingTo={replyingTo}
            replyText={replyText}
            onReplyTextChange={setReplyText}
            onStartReply={handleStartReply}
            onSendReply={handleSendReply}
            onCancelReply={handleCancelReply}
            onLike={toggleCommentLike}
          />
        </ScrollArea>

        {/* Comment Input - Fixed at bottom */}
        <div className="p-4 border-t bg-white mt-auto">
          <CommentInput
            value={newComment}
            onChange={setNewComment}
            onSubmit={handleSendComment}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoComments;
