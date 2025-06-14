
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MessageCircle, User } from 'lucide-react';
import { FeedbackSubmissionWithReview } from '@/hooks/useFeedbackData';

interface FeedbackContentListProps {
  submissions: FeedbackSubmissionWithReview[] | undefined;
  selectedItem: FeedbackSubmissionWithReview | null;
  onItemSelect: (item: FeedbackSubmissionWithReview) => void;
}

export const FeedbackContentList = ({ submissions, selectedItem, onItemSelect }: FeedbackContentListProps) => {
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contenus en attente de révision</h3>
      {submissions?.map((item) => (
        <Card 
          key={item.id} 
          className={`cursor-pointer transition-colors ${
            selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onItemSelect(item)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                {item.content_type === 'video' ? 
                  <Eye className="w-4 h-4" /> : 
                  <MessageCircle className="w-4 h-4" />
                }
                <span className="font-medium">{item.content_title}</span>
              </div>
              <Badge className={getStatusColor(item.status)}>
                {getStatusLabel(item.status)}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {item.submitted_by}
              </span>
              <span>{new Date(item.submitted_at).toLocaleDateString()}</span>
            </div>
            {item.expert_reviews && item.expert_reviews.length > 0 && (
              <div className="mt-2 p-2 bg-muted rounded text-sm">
                <strong>{item.expert_reviews[0].expert_name}:</strong> {item.expert_reviews[0].comment}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
