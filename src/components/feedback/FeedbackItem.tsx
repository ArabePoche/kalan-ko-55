
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp, MessageCircle, CheckCircle, X, AlertTriangle, Reply } from 'lucide-react';
import { FeedbackSubmissionWithReview } from '@/hooks/useFeedbackData';

interface FeedbackItemProps {
  feedback: FeedbackSubmissionWithReview;
  onLike: (feedback: FeedbackSubmissionWithReview) => void;
  onReview: (feedback: FeedbackSubmissionWithReview, action: 'approve' | 'suggest' | 'correct' | 'reject', comment: string) => void;
  isSubmitting: boolean;
}

export const FeedbackItem = ({ feedback, onLike, onReview, isSubmitting }: FeedbackItemProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'needs_revision': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'needs_revision': return 'Révision requise';
      default: return status;
    }
  };

  const handleReview = (action: 'approve' | 'suggest' | 'correct' | 'reject') => {
    if (!reviewComment.trim()) return;
    onReview(feedback, action, reviewComment);
    setReviewComment('');
    setShowReviewForm(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              {getInitials(feedback.submitted_by)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{feedback.submitted_by}</h4>
            <p className="text-xs text-muted-foreground">
              {new Date(feedback.submitted_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(feedback.status)}>
          {getStatusLabel(feedback.status)}
        </Badge>
      </div>

      {/* Reviews */}
      {feedback.expert_reviews && feedback.expert_reviews.length > 0 && (
        <div className="space-y-2">
          {feedback.expert_reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded p-3 text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-xs">{review.expert_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.reviewed_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center space-x-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onLike(feedback)}
            className="text-gray-500 hover:text-blue-600"
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            J'aime
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-gray-500 hover:text-green-600"
          >
            <Reply className="w-4 h-4 mr-1" />
            Répondre
          </Button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="space-y-3 pt-3 border-t">
          <Textarea
            placeholder="Ajouter un commentaire de révision..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="min-h-[80px]"
          />
          
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => handleReview('approve')}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting || !reviewComment.trim()}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approuver
            </Button>
            <Button
              size="sm"
              onClick={() => handleReview('suggest')}
              variant="outline"
              disabled={isSubmitting || !reviewComment.trim()}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Suggérer
            </Button>
            <Button
              size="sm"
              onClick={() => handleReview('correct')}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={isSubmitting || !reviewComment.trim()}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Rectifier
            </Button>
            <Button
              size="sm"
              onClick={() => handleReview('reject')}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting || !reviewComment.trim()}
            >
              <X className="w-4 h-4 mr-1" />
              Rejeter
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowReviewForm(false);
                setReviewComment('');
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
