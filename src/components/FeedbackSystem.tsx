
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Eye, MessageCircle, User, BarChart3, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface FeedbackItem {
  id: string;
  contentId: string;
  contentType: 'video' | 'post';
  contentTitle: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  expertReview?: {
    expertName: string;
    action: 'approve' | 'suggest' | 'correct' | 'reject';
    comment: string;
    reviewedAt: string;
  };
}

interface FeedbackStats {
  totalSubmissions: number;
  pendingReview: number;
  approvedToday: number;
  rejectedToday: number;
  averageReviewTime: string;
  approvalRate: number;
  expertActivity: {
    name: string;
    reviews: number;
  }[];
  contentTypeBreakdown: {
    videos: number;
    posts: number;
  };
}

const mockFeedbackStats: FeedbackStats = {
  totalSubmissions: 157,
  pendingReview: 12,
  approvedToday: 8,
  rejectedToday: 2,
  averageReviewTime: "2.5h",
  approvalRate: 78.5,
  expertActivity: [
    { name: "Dr. Hassan", reviews: 34 },
    { name: "Dr. Fatima", reviews: 28 },
    { name: "Prof. Ahmed", reviews: 19 }
  ],
  contentTypeBreakdown: {
    videos: 89,
    posts: 68
  }
};

const mockFeedbackItems: FeedbackItem[] = [
  {
    id: '1',
    contentId: 'v1',
    contentType: 'video',
    contentTitle: 'Formation Coran - Niveau Débutant',
    submittedBy: 'Prof. Ahmed',
    submittedAt: '2024-01-15',
    status: 'pending'
  },
  {
    id: '2',
    contentId: 'p1',
    contentType: 'post',
    contentTitle: 'Nouveau programme de formation',
    submittedBy: 'Institut Al-Azhar',
    submittedAt: '2024-01-14',
    status: 'approved',
    expertReview: {
      expertName: 'Dr. Hassan',
      action: 'approve',
      comment: 'Contenu excellent, conforme aux standards.',
      reviewedAt: '2024-01-15'
    }
  }
];

const FeedbackSystem = () => {
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const handleReview = (action: 'approve' | 'suggest' | 'correct' | 'reject') => {
    console.log(`Action: ${action}, Comment: ${reviewComment}`);
    setReviewComment('');
    setSelectedItem(null);
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
                <p className="text-2xl font-bold">{mockFeedbackStats.totalSubmissions}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{mockFeedbackStats.pendingReview}</p>
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
                <p className="text-2xl font-bold text-green-600">{mockFeedbackStats.approvalRate}%</p>
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
                <p className="text-2xl font-bold">{mockFeedbackStats.averageReviewTime}</p>
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
            {mockFeedbackStats.expertActivity.map((expert, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{expert.name}</span>
                <Badge variant="outline">{expert.reviews} révisions</Badge>
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
              <span className="font-bold text-green-600">{mockFeedbackStats.approvedToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <ThumbsDown className="w-4 h-4 text-red-500" />
                Rejetés
              </span>
              <span className="font-bold text-red-600">{mockFeedbackStats.rejectedToday}</span>
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
              <span className="font-bold">{mockFeedbackStats.contentTypeBreakdown.videos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Publications
              </span>
              <span className="font-bold">{mockFeedbackStats.contentTypeBreakdown.posts}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Liste des contenus à réviser */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contenus en attente de révision</h3>
          {mockFeedbackItems.map((item) => (
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
                    {item.contentType === 'video' ? 
                      <Eye className="w-4 h-4" /> : 
                      <MessageCircle className="w-4 h-4" />
                    }
                    <span className="font-medium">{item.contentTitle}</span>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {item.submittedBy}
                  </span>
                  <span>{item.submittedAt}</span>
                </div>
                {item.expertReview && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <strong>{item.expertReview.expertName}:</strong> {item.expertReview.comment}
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
                  <h4 className="font-semibold">{selectedItem.contentTitle}</h4>
                  <p className="text-sm text-muted-foreground">
                    Soumis par {selectedItem.submittedBy} le {selectedItem.submittedAt}
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
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Approuver
                  </Button>
                  <Button 
                    onClick={() => handleReview('suggest')}
                    variant="outline"
                  >
                    Proposer
                  </Button>
                  <Button 
                    onClick={() => handleReview('correct')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Rectifier
                  </Button>
                  <Button 
                    onClick={() => handleReview('reject')}
                    className="bg-red-600 hover:bg-red-700"
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
