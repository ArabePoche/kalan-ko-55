
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FeedbackSubmission = Database['public']['Tables']['feedback_submissions']['Row'];
type ExpertReview = Database['public']['Tables']['expert_reviews']['Row'];

export interface FeedbackSubmissionWithReview extends FeedbackSubmission {
  expert_reviews?: ExpertReview[];
}

export const useVideoFeedback = (videoId: string) => {
  return useQuery({
    queryKey: ['video-feedback', videoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select(`
          *,
          expert_reviews (*)
        `)
        .eq('content_id', videoId)
        .eq('content_type', 'video')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data as FeedbackSubmissionWithReview[];
    },
    enabled: !!videoId,
  });
};

export const useSubmitVideoFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      videoId, 
      contentTitle,
      submittedBy,
      comment 
    }: {
      videoId: string;
      contentTitle: string;
      submittedBy: string;
      comment: string;
    }) => {
      const { error } = await supabase
        .from('feedback_submissions')
        .insert({
          content_id: videoId,
          content_type: 'video',
          content_title: contentTitle,
          submitted_by: submittedBy,
          status: 'pending',
        });

      if (error) throw error;

      // Add the comment as an initial review
      const { data: submissionData } = await supabase
        .from('feedback_submissions')
        .select('id')
        .eq('content_id', videoId)
        .eq('content_type', 'video')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (submissionData) {
        await supabase
          .from('expert_reviews')
          .insert({
            submission_id: submissionData.id,
            expert_name: submittedBy,
            action: 'suggest',
            comment: comment,
          });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['video-feedback', variables.videoId] });
    },
  });
};

export const useSubmitFeedbackReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      submissionId, 
      expertName, 
      action, 
      comment,
      videoId
    }: {
      submissionId: string;
      expertName: string;
      action: 'approve' | 'suggest' | 'correct' | 'reject';
      comment: string;
      videoId: string;
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
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['video-feedback', variables.videoId] });
    },
  });
};

export const useLikeFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      submissionId, 
      expertName,
      videoId
    }: {
      submissionId: string;
      expertName: string;
      videoId: string;
    }) => {
      const { error } = await supabase
        .from('expert_reviews')
        .insert({
          submission_id: submissionId,
          expert_name: expertName,
          action: 'approve',
          comment: '👍 Feedback apprécié',
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['video-feedback', variables.videoId] });
    },
  });
};
