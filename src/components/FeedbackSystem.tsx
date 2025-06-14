
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Eye, MessageCircle, User, BarChart3, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useFeedbackSubmissions, useFeedbackStats, useExpertActivity, useSubmitReview, FeedbackSubmissionWithReview } from '@/hooks/useFeedbackData';
import { useToast } from '@/hooks/use-toast';

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

  if (submissionsLoading || statsLoading || expertActivityLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  const contentTypeBreakdown = getContentTypeBreakdown();
  const todayStats = getTodayStats();
  const pendingCount = submissions?.filter(s => s.status === 'pending').length || 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Système de Feedback</h2>
        <p className="text-muted-foreground">Modération et validation des contenus</p>
      </div>

      {/* Statistiques Dashboard */}
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

      {/* Statistiques Détaillées */}
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Liste des contenus à réviser */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contenus en attente de révision</h3>
          {submissions?.map((item) => (
            <Card 
              key={item.id} 
              className={`cursor-pointer transition-colors ${
                selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedItem(item)}
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

        {/* Panel de révision */}
        <div>
          {selectedItem ? (
            <Card>
              <CardHeader>
                <CardTitle>Révision du contenu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">{selectedItem.content_title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Soumis par {selectedItem.submitted_by} le {new Date(selectedItem.submitted_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-muted p-4 rounded">
                  <p className="text-sm">Aperçu du contenu à réviser...</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Commentaire d'expert</label>
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Ajoutez vos commentaires de révision..."
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => handleReview('approve')}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={submitReviewMutation.isPending}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approuver
                  </Button>
                  <Button 
                    onClick={() => handleReview('suggest')}
                    variant="outline"
                    disabled={submitReviewMutation.isPending}
                  >
                    Proposer
                  </Button>
                  <Button 
                    onClick={() => handleReview('correct')}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={submitReviewMutation.isPending}
                  >
                    Rectifier
                  </Button>
                  <Button 
                    onClick={() => handleReview('reject')}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={submitReviewMutation.isPending}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Sélectionnez un contenu à réviser
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSystem;
