
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Eye, MessageCircle, User } from 'lucide-react';
import { FeedbackSubmissionWithReview } from '@/hooks/useFeedbackData';
import type { Database } from '@/integrations/supabase/types';

type ExpertActivity = Database['public']['Tables']['expert_activity']['Row'];

interface FeedbackDetailedStatsProps {
  submissions: FeedbackSubmissionWithReview[] | undefined;
  expertActivity: ExpertActivity[] | undefined;
}

export const FeedbackDetailedStats = ({ submissions, expertActivity }: FeedbackDetailedStatsProps) => {
  const getContentTypeBreakdown = () => {
    if (!submissions) return { videos: 0, posts: 0 };
    return submissions.reduce((acc, submission) => {
      if (submission.content_type === 'video') acc.videos++;
      else acc.posts++;
      return acc;
    }, { videos: 0, posts: 0 });
  };

  const getTodayStats = () => {
    if (!submissions) return { approved: 0, rejected: 0 };
    const today = new Date().toDateString();
    return submissions
      .filter(s => s.expert_reviews && s.expert_reviews.length > 0)
      .reduce((acc, submission) => {
        const latestReview = submission.expert_reviews![0];
        const reviewDate = new Date(latestReview.reviewed_at).toDateString();
        if (reviewDate === today) {
          if (latestReview.action === 'approve') acc.approved++;
          else if (latestReview.action === 'reject') acc.rejected++;
        }
        return acc;
      }, { approved: 0, rejected: 0 });
  };

  const contentTypeBreakdown = getContentTypeBreakdown();
  const todayStats = getTodayStats();

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Activité des Experts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {expertActivity?.map((expert, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium">{expert.expert_name}</span>
              <Badge variant="outline">{expert.reviews_count} révisions</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Révisions Aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-green-500" />
              Approuvés
            </span>
            <span className="font-bold text-green-600">{todayStats.approved}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              Rejetés
            </span>
            <span className="font-bold text-red-600">{todayStats.rejected}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Types de Contenu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Vidéos
            </span>
            <span className="font-bold">{contentTypeBreakdown.videos}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Publications
            </span>
            <span className="font-bold">{contentTypeBreakdown.posts}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
