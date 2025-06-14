
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageCircle, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useVideoFeedback, 
  useSubmitVideoFeedback, 
  useSubmitFeedbackReview, 
  useLikeFeedback,
  FeedbackSubmissionWithReview 
} from '@/hooks/useFeedbackData';

interface VideoFeedbackPanelProps {
  videoId: string;
  videoTitle: string;
}

export const VideoFeedbackPanel = ({ videoId, videoTitle }: VideoFeedbackPanelProps) => {
  const [newFeedback, setNewFeedback] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [reviewComments, setReviewComments] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const { data: feedbacks, isLoading } = useVideoFeedback(videoId);
  const submitFeedbackMutation = useSubmitVideoFeedback();
  const submitReviewMutation = useSubmitFeedbackReview();
  const likeFeedbackMutation = useLikeFeedback();

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

  const handleSubmitFeedback = () => {
    if (!newFeedback.trim() || !submitterName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    submitFeedbackMutation.mutate({
      videoId,
      contentTitle: videoTitle,
      submittedBy: submitterName,
      comment: newFeedback,
    }, {
      onSuccess: () => {
        toast({
          title: "Feedback soumis",
          description: "Votre feedback a été ajouté avec succès.",
        });
        setNewFeedback('');
        setSubmitterName('');
        setShowAddForm(false);
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

  const handleReview = (feedback: FeedbackSubmissionWithReview, action: 'approve' | 'suggest' | 'correct' | 'reject') => {
    const comment = reviewComments[feedback.id] || '';
    if (!comment.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter un commentaire.",
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({
      submissionId: feedback.id,
      expertName: 'Expert Actuel', // Should come from auth context
      action,
      comment,
      videoId,
    }, {
      onSuccess: () => {
        toast({
          title: "Révision soumise",
          description: "Votre révision a été enregistrée.",
        });
        setReviewComments(prev => ({ ...prev, [feedback.id]: '' }));
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
        <div className="flex justify-between items-center">
          <CardTitle>Feedbacks - {videoTitle}</CardTitle>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            variant="outline"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ajouter un feedback
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder="Votre nom"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
              />
              <Textarea
                placeholder="Votre feedback sur cette vidéo..."
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitFeedback}
                  disabled={submitFeedbackMutation.isPending}
                >
                  Soumettre
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {feedbacks?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun feedback pour cette vidéo
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks?.map((feedback) => (
              <Card key={feedback.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{feedback.submitted_by}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(feedback.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(feedback.status)}>
                        {getStatusLabel(feedback.status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLike(feedback)}
                        disabled={likeFeedbackMutation.isPending}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {feedback.expert_reviews && feedback.expert_reviews.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {feedback.expert_reviews.map((review) => (
                        <div key={review.id} className="p-2 bg-muted rounded text-sm">
                          <strong>{review.expert_name}:</strong> {review.comment}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Textarea
                      placeholder="Ajouter un commentaire de révision..."
                      value={reviewComments[feedback.id] || ''}
                      onChange={(e) => setReviewComments(prev => ({ 
                        ...prev, 
                        [feedback.id]: e.target.value 
                      }))}
                    />
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => handleReview(feedback, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={submitReviewMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReview(feedback, 'suggest')}
                        variant="outline"
                        disabled={submitReviewMutation.isPending}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Suggérer
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReview(feedback, 'correct')}
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={submitReviewMutation.isPending}
                      >
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Rectifier
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReview(feedback, 'reject')}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={submitReviewMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
