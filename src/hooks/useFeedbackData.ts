
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FeedbackSubmission = Database['public']['Tables']['feedback_submissions']['Row'];
type ExpertReview = Database['public']['Tables']['expert_reviews']['Row'];
type FeedbackStats = Database['public']['Tables']['feedback_stats']['Row'];
type ExpertActivity = Database['public']['Tables']['expert_activity']['Row'];

export interface FeedbackSubmissionWithReview extends FeedbackSubmission {
  expert_reviews?: ExpertReview[];
}

export const useFeedbackSubmissions = () => {
  return useQuery({
    queryKey: ['feedback-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select(`
          *,
          expert_reviews (*)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as FeedbackSubmissionWithReview[];
    },
  });
};

export const useFeedbackStats = () => {
  return useQuery({
    queryKey: ['feedback-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data as FeedbackStats;
    },
  });
};

export const useExpertActivity = () => {
  return useQuery({
    queryKey: ['expert-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expert_activity')
        .select('*')
        .order('reviews_count', { ascending: false });

      if (error) throw error;
      return data as ExpertActivity[];
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      submissionId, 
      expertName, 
      action, 
      comment 
    }: {
      submissionId: string;
      expertName: string;
      action: 'approve' | 'suggest' | 'correct' | 'reject';
      comment: string;
    }) => {
      // Insert the review
      const { error: reviewError } = await supabase
        .from('expert_reviews')
        .insert({
          submission_id: submissionId,
          expert_name: expertName,
          action,
          comment,
        });

      if (reviewError) throw reviewError;

      // Update submission status based on action
      const statusMap = {
        approve: 'approved',
        suggest: 'needs_revision',
        correct: 'needs_revision',
        reject: 'rejected',
      };

      const { error: updateError } = await supabase
        .from('feedback_submissions')
        .update({ status: statusMap[action] })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      // Update expert activity
      const { data: expertData } = await supabase
        .from('expert_activity')
        .select('*')
        .eq('expert_name', expertName)
        .single();

      if (expertData) {
        await supabase
          .from('expert_activity')
          .update({
            reviews_count: expertData.reviews_count + 1,
            last_review_at: new Date().toISOString(),
          })
          .eq('expert_name', expertName);
      } else {
        await supabase
          .from('expert_activity')
          .insert({
            expert_name: expertName,
            reviews_count: 1,
            last_review_at: new Date().toISOString(),
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['expert-activity'] });
      queryClient.invalidateQueries({ queryKey: ['feedback-stats'] });
    },
  });
};
