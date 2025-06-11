import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Video, BookOpen, Users, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  likes: number;
  dislikes: number;
  views: number;
  status: 'pending' | 'published' | 'rejected';
}

interface Formation {
  id: string;
  title: string;
  instructor: string;
  lessons: number;
  students: number;
  status: 'active' | 'draft' | 'archived';
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Vidéos', value: 124, icon: Video },
    { label: 'Formations', value: 32, icon: BookOpen },
    { label: 'Utilisateurs', value: 2345, icon: Users }
  ];

  const videos: Video[] = [
    { id: '1', title: 'Formation Coran - Niveau Débutant', instructor: 'Professeur Ahmed', duration: '2h 30m', likes: 1234, dislikes: 123, views: 12345, status: 'published' },
    { id: '2', title: 'Les bases de la langue arabe', instructor: 'Professeur Fatima', duration: '1h 45m', likes: 876, dislikes: 56, views: 8765, status: 'pending' }
  ];

  const formations: Formation[] = [
    { id: '1', title: 'Formation Coran Complète', instructor: 'Professeur Ahmed', lessons: 20, students: 567, status: 'active' },
    { id: '2', title: 'Grammaire Arabe Avancée', instructor: 'Professeur Fatima', lessons: 15, students: 345, status: 'draft' }
  ];

  const users = [
    { id: '1', name: 'Ahmed Hassan', email: 'ahmed@email.com', courses: 3, status: 'active' },
    { id: '2', name: 'Fatima Al-Zahra', email: 'fatima@email.com', courses: 1, status: 'pending' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-muted-foreground">Suivez l'activité de votre plateforme</p>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={activeTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="videos">Vidéos</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <h3 className="text-xl font-semibold">Statistiques Générales</h3>
          <p>Ici, vous pouvez voir un aperçu rapide de l'activité de votre plateforme.</p>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Gestion des Vidéos</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle vidéo
            </Button>
          </div>

          <div className="grid gap-4">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{video.title}</h4>
                      <p className="text-sm text-muted-foreground">{video.instructor}</p>
                      <p className="text-sm">{video.duration}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={video.status === 'published' ? 'default' : 'secondary'}>
                        {video.status}
                      </Badge>
                      <Button variant="outline" size="sm">Voir détails</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formations" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Gestion des Formations</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle formation
            </Button>
          </div>

          <div className="grid gap-4">
            {formations.map((formation) => (
              <Card key={formation.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{formation.title}</h4>
                      <p className="text-sm text-muted-foreground">{formation.instructor}</p>
                      <p className="text-sm">{formation.lessons} leçons, {formation.students} étudiants</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={formation.status === 'active' ? 'default' : 'secondary'}>
                        {formation.status}
                      </Badge>
                      <Button variant="outline" size="sm">Voir détails</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Gestion des Utilisateurs</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </div>

          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-sm">{user.courses} cours inscrits</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                      <Button variant="outline" size="sm">Voir détails</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
