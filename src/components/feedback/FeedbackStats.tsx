
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, CheckCircle, AlertTriangle, X, Clock } from 'lucide-react';
import { FeedbackSubmissionWithReview } from '@/hooks/useFeedbackData';

interface FeedbackStatsProps {
  feedbacks: FeedbackSubmissionWithReview[] | undefined;
}

export const FeedbackStats = ({ feedbacks }: FeedbackStatsProps) => {
  const stats = {
    total: feedbacks?.length || 0,
    pending: feedbacks?.filter(f => f.status === 'pending').length || 0,
    approved: feedbacks?.filter(f => f.status === 'approved').length || 0,
    rejected: feedbacks?.filter(f => f.status === 'rejected').length || 0,
    needsRevision: feedbacks?.filter(f => f.status === 'needs_revision').length || 0,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
      <Card className="bg-blue-50">
        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <MessageCircle className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-lg font-bold text-blue-600">{stats.total}</span>
          </div>
          <p className="text-xs text-blue-600">Total</p>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50">
        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-yellow-600 mr-1" />
            <span className="text-lg font-bold text-yellow-600">{stats.pending}</span>
          </div>
          <p className="text-xs text-yellow-600">En attente</p>
        </CardContent>
      </Card>

      <Card className="bg-green-50">
        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-lg font-bold text-green-600">{stats.approved}</span>
          </div>
          <p className="text-xs text-green-600">Approuvés</p>
        </CardContent>
      </Card>

      <Card className="bg-orange-50">
        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <AlertTriangle className="w-4 h-4 text-orange-600 mr-1" />
            <span className="text-lg font-bold text-orange-600">{stats.needsRevision}</span>
          </div>
          <p className="text-xs text-orange-600">Révision</p>
        </CardContent>
      </Card>

      <Card className="bg-red-50">
        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <X className="w-4 h-4 text-red-600 mr-1" />
            <span className="text-lg font-bold text-red-600">{stats.rejected}</span>
          </div>
          <p className="text-xs text-red-600">Rejetés</p>
        </CardContent>
      </Card>
    </div>
  );
};
