
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  useVideoFeedback, 
  useSubmitVideoFeedback, 
  useSubmitFeedbackReview, 
  useLikeFeedback,
  FeedbackSubmissionWithReview 
} from '@/hooks/useFeedbackData';
import { FeedbackStats } from './FeedbackStats';
import { FeedbackItem } from './FeedbackItem';
import { FeedbackInput } from './FeedbackInput';

interface VideoFeedbackPanelProps {
  videoId: string;
  videoTitle: string;
}

export const VideoFeedbackPanel = ({ videoId, videoTitle }: VideoFeedbackPanelProps) => {
  const { toast } = useToast();

  const { data: feedbacks, isLoading } = useVideoFeedback(videoId);
  const submitFeedbackMutation = useSubmitVideoFeedback();
  const submitReviewMutation = useSubmitFeedbackReview();
  const likeFeedbackMutation = useLikeFeedback();

  const handleSubmitFeedback = (submitterName: string, comment: string) => {
    submitFeedbackMutation.mutate({
      videoId,
      contentTitle: videoTitle,
      submittedBy: submitterName,
      comment,
    }, {
      onSuccess: () => {
        toast({
          title: "Feedback soumis",
          description: "Votre feedback a été ajouté avec succès.",
        });
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la soumission.",
          variant: "destructive",
        });
      },
    });
  };

  const handleReview = (feedback: FeedbackSubmissionWithReview, action: 'approve' | 'suggest' | 'correct' | 'reject', comment: string) => {
    submitReviewMutation.mutate({
      submissionId: feedback.id,
      expertName: 'Expert Actuel',
      action,
      comment,
      videoId,
    }, {
      onSuccess: () => {
        toast({
          title: "Révision soumise",
          description: "Votre révision a été enregistrée.",
        });
      },
      onError: () => {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue.",
          variant: "destructive",
        });
      },
    });
  };

  const handleLike = (feedback: FeedbackSubmissionWithReview) => {
    likeFeedbackMutation.mutate({
      submissionId: feedback.id,
      expertName: 'Expert Actuel',
      videoId,
    }, {
      onSuccess: () => {
        toast({
          description: "Feedback apprécié!",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des feedbacks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Feedbacks - {videoTitle}</CardTitle>
        <FeedbackStats feedbacks={feedbacks} />
      </CardHeader>
      <CardContent className="space-y-4">
        <FeedbackInput 
          onSubmit={handleSubmitFeedback}
          isSubmitting={submitFeedbackMutation.isPending}
        />

        {feedbacks?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun feedback pour cette vidéo
          </div>
        ) : (
          <ScrollArea className="max-h-[600px]">
            <div className="space-y-4">
              {feedbacks?.map((feedback) => (
                <FeedbackItem
                  key={feedback.id}
                  feedback={feedback}
                  onLike={handleLike}
                  onReview={handleReview}
                  isSubmitting={submitReviewMutation.isPending || likeFeedbackMutation.isPending}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
