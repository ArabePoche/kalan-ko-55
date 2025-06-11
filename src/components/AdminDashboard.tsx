
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Video, BookOpen, Users, Upload, Eye, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [newVideo, setNewVideo] = useState({ title: '', description: '', price: '' });
  const [newFormation, setNewFormation] = useState({ title: '', description: '', price: '' });

  const stats = [
    { title: 'Total Vidéos', value: '124', icon: Video, color: 'text-blue-600' },
    { title: 'Total Formations', value: '18', icon: BookOpen, color: 'text-green-600' },
    { title: 'Utilisateurs Actifs', value: '2,847', icon: Users, color: 'text-purple-600' },
    { title: 'Revenus ce mois', value: '12,450€', icon: DollarSign, color: 'text-orange-600' }
  ];

  const videos = [
    { id: '1', title: 'Introduction au Coran', views: 1234, status: 'Publié' },
    { id: '2', title: 'Règles de Tajwid', views: 856, status: 'En révision' }
  ];

  const formations = [
    {
      id: '1',
      title: 'Formation Coran Complet',
      students: 45,
      levels: [
        {
          id: '1',
          title: 'Niveau 1 - Bases',
          lessons: ['Introduction', 'Alphabet arabe', 'Première sourate']
        },
        {
          id: '2',
          title: 'Niveau 2 - Intermédiaire',
          lessons: ['Règles de lecture', 'Tajwid débutant']
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrateur</h1>
        <p className="text-muted-foreground">Gérez vos contenus et suivez vos performances</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="videos">Gestion Vidéos</TabsTrigger>
          <TabsTrigger value="formations">Gestion Formations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Nouvelle vidéo visionnée 1,234 fois</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm">15 nouveaux étudiants inscrits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Revenus en hausse de 12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contenus Populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {videos.slice(0, 3).map((video) => (
                    <div key={video.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{video.title}</span>
                      <Badge variant="secondary">{video.views} vues</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
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
            <CardContent className="space-y-4">
              <Input
                placeholder="Titre de la vidéo"
                value={newVideo.title}
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
              />
              <Textarea
                placeholder="Description"
                value={newVideo.description}
                onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
              />
              <Input
                placeholder="Prix (€)"
                type="number"
                value={newVideo.price}
                onChange={(e) => setNewVideo({...newVideo, price: e.target.value})}
              />
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Télécharger Vidéo
                </Button>
                <Button className="flex-1">Publier</Button>
              </div>
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
        </TabsContent>

        <TabsContent value="formations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gestion des Formations</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Formation
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ajouter une nouvelle formation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Titre de la formation"
                value={newFormation.title}
                onChange={(e) => setNewFormation({...newFormation, title: e.target.value})}
              />
              <Textarea
                placeholder="Description"
                value={newFormation.description}
                onChange={(e) => setNewFormation({...newFormation, description: e.target.value})}
              />
              <Input
                placeholder="Prix (€)"
                type="number"
                value={newFormation.price}
                onChange={(e) => setNewFormation({...newFormation, price: e.target.value})}
              />
              <Button className="w-full">Créer Formation</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formations Existantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formations.map((formation) => (
                  <div key={formation.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{formation.title}</h3>
                        <p className="text-sm text-muted-foreground">{formation.students} étudiants</p>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Niveaux:</h4>
                      {formation.levels.map((level) => (
                        <div key={level.id} className="ml-4 p-2 bg-muted rounded">
                          <p className="text-sm font-medium">{level.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {level.lessons.length} leçons: {level.lessons.join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
