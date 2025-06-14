
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { VideoComment } from '@/types/comments';
import { CommentItem } from './CommentItem';
import { ReplyInput } from './ReplyInput';

interface CommentsListProps {
  comments: VideoComment[];
  loading: boolean;
  replyingTo: string | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onStartReply: (commentId: string) => void;
  onSendReply: (commentId: string) => void;
  onCancelReply: () => void;
  onLike: (commentId: string) => void;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  loading,
  replyingTo,
  replyText,
  onReplyTextChange,
  onStartReply,
  onSendReply,
  onCancelReply,
  onLike
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Chargement des commentaires...</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Aucun commentaire pour le moment</p>
          <p className="text-sm">Soyez le premier à commenter!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-3">
          {/* Main Comment */}
          <CommentItem
            comment={comment}
            onLike={onLike}
            onReply={onStartReply}
          />

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <ReplyInput
              value={replyText}
              onChange={onReplyTextChange}
              onSubmit={() => onSendReply(comment.id)}
              onCancel={onCancelReply}
            />
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-11 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onReply={() => {}}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
