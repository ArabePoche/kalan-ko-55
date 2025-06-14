
import { useState } from 'react';
import { useFeedbackSubmissions, useFeedbackStats, useExpertActivity, useSubmitReview, FeedbackSubmissionWithReview } from '@/hooks/useFeedbackData';
import { useToast } from '@/hooks/use-toast';
import { FeedbackStatsDashboard } from './feedback/FeedbackStatsDashboard';
import { FeedbackDetailedStats } from './feedback/FeedbackDetailedStats';
import { FeedbackContentList } from './feedback/FeedbackContentList';
import { FeedbackReviewPanel } from './feedback/FeedbackReviewPanel';

const FeedbackSystem = () => {
  const [selectedItem, setSelectedItem] = useState<FeedbackSubmissionWithReview | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const { toast } = useToast();

  const { data: submissions, isLoading: submissionsLoading } = useFeedbackSubmissions();
  const { data: stats, isLoading: statsLoading } = useFeedbackStats();
  const { data: expertActivity, isLoading: expertActivityLoading } = useExpertActivity();
  const submitReviewMutation = useSubmitReview();

  const handleReview = (action: 'approve' | 'suggest' | 'correct' | 'reject') => {
    if (!selectedItem || !reviewComment.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un contenu et ajouter un commentaire.",
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({
      submissionId: selectedItem.id,
      expertName: 'Expert Actuel', // This should come from auth context
      action,
      comment: reviewComment,
    }, {
      onSuccess: () => {
        toast({
          title: "Révision soumise",
          description: "Votre révision a été enregistrée avec succès.",
        });
        setReviewComment('');
        setSelectedItem(null);
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la soumission.",
          variant: "destructive",
        });
        console.error('Review submission error:', error);
      },
    });
  };

  if (submissionsLoading || statsLoading || expertActivityLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Système de Feedback</h2>
        <p className="text-muted-foreground">Modération et validation des contenus</p>
      </div>

      <FeedbackStatsDashboard submissions={submissions} stats={stats} />
      
      <FeedbackDetailedStats submissions={submissions} expertActivity={expertActivity} />

      <div className="grid lg:grid-cols-2 gap-6">
        <FeedbackContentList 
          submissions={submissions}
          selectedItem={selectedItem}
          onItemSelect={setSelectedItem}
        />

        <FeedbackReviewPanel
          selectedItem={selectedItem}
          reviewComment={reviewComment}
          onReviewCommentChange={setReviewComment}
          onReview={handleReview}
          isSubmitting={submitReviewMutation.isPending}
        />
      </div>
    </div>
  );
};

export default FeedbackSystem;
