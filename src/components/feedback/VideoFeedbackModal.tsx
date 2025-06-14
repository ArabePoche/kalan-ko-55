
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { Clock, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface VideoFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
}

export const VideoFeedbackModal = ({ isOpen, onClose, videoId, videoTitle }: VideoFeedbackModalProps) => {
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

  const categorizeFeeedbacks = (feedbacks: FeedbackSubmissionWithReview[] | undefined) => {
    if (!feedbacks) return { pending: [], approved: [], rejected: [], needsRevision: [] };
    
    return {
      pending: feedbacks.filter(f => f.status === 'pending'),
      approved: feedbacks.filter(f => f.status === 'approved'),
      rejected: feedbacks.filter(f => f.status === 'rejected'),
      needsRevision: feedbacks.filter(f => f.status === 'needs_revision'),
    };
  };

  const categorizedFeedbacks = categorizeFeeedbacks(feedbacks);

  const FeedbackCategory = ({ 
    title, 
    icon: Icon, 
    feedbacks, 
    color 
  }: { 
    title: string; 
    icon: any; 
    feedbacks: FeedbackSubmissionWithReview[]; 
    color: string; 
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className="font-medium text-sm">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {feedbacks.length}
        </Badge>
      </div>
      
      {feedbacks.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Aucun feedback dans cette catégorie
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((feedback) => (
            <FeedbackItem
              key={feedback.id}
              feedback={feedback}
              onLike={handleLike}
              onReview={handleReview}
              isSubmitting={submitReviewMutation.isPending || likeFeedbackMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[600px] sm:max-w-[90vw]">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left">Feedbacks - {videoTitle}</SheetTitle>
          <SheetDescription className="text-left">
            Gérez et modérez les feedbacks de cette vidéo
          </SheetDescription>
          <FeedbackStats feedbacks={feedbacks} />
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-200px)]">
          <div className="mb-4">
            <FeedbackInput 
              onSubmit={handleSubmitFeedback}
              isSubmitting={submitFeedbackMutation.isPending}
            />
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                Chargement des feedbacks...
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <div className="space-y-6 pr-4">
                <FeedbackCategory
                  title="En attente de révision"
                  icon={Clock}
                  feedbacks={categorizedFeedbacks.pending}
                  color="text-yellow-600"
                />
                
                <Separator />
                
                <FeedbackCategory
                  title="Approuvés"
                  icon={CheckCircle}
                  feedbacks={categorizedFeedbacks.approved}
                  color="text-green-600"
                />
                
                <Separator />
                
                <FeedbackCategory
                  title="Nécessitent une révision"
                  icon={AlertTriangle}
                  feedbacks={categorizedFeedbacks.needsRevision}
                  color="text-orange-600"
                />
                
                <Separator />
                
                <FeedbackCategory
                  title="Rejetés"
                  icon={X}
                  feedbacks={categorizedFeedbacks.rejected}
                  color="text-red-600"
                />
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
