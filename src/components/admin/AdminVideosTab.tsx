
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import VideoCreateForm from '../VideoCreateForm';

interface AdminVideosTabProps {
  categories: any[];
  loadingCategories: boolean;
}

export default function AdminVideosTab({ categories, loadingCategories }: AdminVideosTabProps) {
  const videos = [
    { id: '1', title: 'Introduction au Coran', views: 1234, status: 'Publié' },
    { id: '2', title: 'Règles de Tajwid', views: 856, status: 'En révision' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des Vidéos</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Vidéo
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle vidéo</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoCreateForm
            categories={categories || []}
            loadingCategories={loadingCategories}
            onCreated={() => {/* Optionally could trigger refetch of videos here */}}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Vidéos Existantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {videos.map((video) => (
              <div key={video.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.views} vues</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={video.status === 'Publié' ? 'default' : 'secondary'}>
                    {video.status}
                  </Badge>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
