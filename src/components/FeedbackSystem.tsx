
import { useState } from 'react';
import { VideoFeedbackPanel } from './feedback/VideoFeedbackPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const FeedbackSystem = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [searchVideoId, setSearchVideoId] = useState<string>('');

  // Sample video IDs for testing - in real app, this would come from a video selection component
  const sampleVideos = [
    { id: '4000d84d-d52a-41ff-958e-50cc294a9396', title: 'Formation Coran - Niveau Débutant' },
    { id: 'v2', title: 'Tajwid Avancé' },
    { id: 'v3', title: 'Histoire Islamique' },
  ];

  const handleVideoSelect = (videoId: string, title: string) => {
    setSelectedVideoId(videoId);
    setVideoTitle(title);
  };

  const handleSearchVideo = () => {
    if (searchVideoId.trim()) {
      setSelectedVideoId(searchVideoId.trim());
      setVideoTitle(`Vidéo ${searchVideoId.trim()}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Système de Feedback par Vidéo</h2>
        <p className="text-muted-foreground">Gérez les feedbacks spécifiques à chaque vidéo</p>
      </div>

      {!selectedVideoId ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rechercher une vidéo par ID</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Entrez l'ID de la vidéo..."
                  value={searchVideoId}
                  onChange={(e) => setSearchVideoId(e.target.value)}
                />
                <Button onClick={handleSearchVideo}>
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ou sélectionnez une vidéo d'exemple</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleVideoSelect(video.id, video.title)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">ID: {video.id}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedVideoId('');
                setVideoTitle('');
              }}
            >
              ← Retour à la sélection
            </Button>
            <div>
              <h3 className="font-medium">Vidéo sélectionnée: {videoTitle}</h3>
              <p className="text-sm text-muted-foreground">ID: {selectedVideoId}</p>
            </div>
          </div>

          <VideoFeedbackPanel 
            videoId={selectedVideoId} 
            videoTitle={videoTitle}
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackSystem;
