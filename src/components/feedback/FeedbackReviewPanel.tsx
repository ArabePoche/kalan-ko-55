
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { FeedbackSubmissionWithReview } from '@/hooks/useFeedbackData';

interface FeedbackReviewPanelProps {
  selectedItem: FeedbackSubmissionWithReview | null;
  reviewComment: string;
  onReviewCommentChange: (comment: string) => void;
  onReview: (action: 'approve' | 'suggest' | 'correct' | 'reject') => void;
  isSubmitting: boolean;
}

export const FeedbackReviewPanel = ({ 
  selectedItem, 
  reviewComment, 
  onReviewCommentChange, 
  onReview,
  isSubmitting 
}: FeedbackReviewPanelProps) => {
  if (!selectedItem) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Sélectionnez un contenu à réviser
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Révision du contenu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">{selectedItem.content_title}</h4>
          <p className="text-sm text-muted-foreground">
            Soumis par {selectedItem.submitted_by} le {new Date(selectedItem.submitted_at).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-muted p-4 rounded">
          <p className="text-sm">Aperçu du contenu à réviser...</p>
        </div>

        <div>
          <label className="text-sm font-medium">Commentaire d'expert</label>
          <Textarea
            value={reviewComment}
            onChange={(e) => onReviewCommentChange(e.target.value)}
            placeholder="Ajoutez vos commentaires de révision..."
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => onReview('approve')}
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Approuver
          </Button>
          <Button 
            onClick={() => onReview('suggest')}
            variant="outline"
            disabled={isSubmitting}
          >
            Proposer
          </Button>
          <Button 
            onClick={() => onReview('correct')}
            className="bg-orange-600 hover:bg-orange-700"
            disabled={isSubmitting}
          >
            Rectifier
          </Button>
          <Button 
            onClick={() => onReview('reject')}
            className="bg-red-600 hover:bg-red-700"
            disabled={isSubmitting}
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            Rejeter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
