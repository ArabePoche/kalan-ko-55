
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { FeedbackSubmissionWithReview } from '@/hooks/useFeedbackData';
import type { Database } from '@/integrations/supabase/types';

type FeedbackStats = Database['public']['Tables']['feedback_stats']['Row'];

interface FeedbackStatsDashboardProps {
  submissions: FeedbackSubmissionWithReview[] | undefined;
  stats: FeedbackStats | undefined;
}

export const FeedbackStatsDashboard = ({ submissions, stats }: FeedbackStatsDashboardProps) => {
  const pendingCount = submissions?.filter(s => s.status === 'pending').length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Soumissions</p>
              <p className="text-2xl font-bold">{submissions?.length || 0}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En Attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taux d'Approbation</p>
              <p className="text-2xl font-bold text-green-600">{stats?.approval_rate || 0}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Temps Moyen</p>
              <p className="text-2xl font-bold">{stats?.average_review_time_hours || 0}h</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
