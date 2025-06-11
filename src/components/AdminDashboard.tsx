
import { useState } from 'react';
import { Plus, Video, BookOpen, Upload, Users, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'formations' | 'students'>('overview');

  const stats = {
    totalStudents: 1243,
    totalFormations: 15,
    totalVideos: 128,
    revenue: 15420
  };

  const recentVideos = [
    { id: '1', title: 'Introduction au Coran', views: 245, likes: 32, date: '2024-03-10' },
    { id: '2', title: 'Alphabet arabe', views: 189, likes: 28, date: '2024-03-09' },
    { id: '3', title: 'Première sourate', views: 156, likes: 24, date: '2024-03-08' }
  ];

  const formations = [
    { id: '1', title: 'Formation Coran Complet', students: 342, revenue: 8540, status: 'Actif' },
    { id: '2', title: 'Sciences Islamiques', students: 189, revenue: 4720, status: 'Actif' },
    { id: '3', title: 'Langue Arabe', students: 156, revenue: 2160, status: 'Brouillon' }
  ];

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'videos', label: 'Vidéos', icon: Video },
    { id: 'formations', label: 'Formations', icon: BookOpen },
    { id: 'students', label: 'Étudiants', icon: Users },
  ];

  return (
    <div className="max-w-6xl mx-auto bg-background min-h-screen p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Admin</h1>
        <p className="text-muted-foreground">Gérez vos contenus et formations</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-secondary rounded-lg p-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Étudiants</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Formations</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalFormations}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vidéos</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalVideos}</p>
                  </div>
                  <Video className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenus</p>
                    <p className="text-2xl font-bold text-foreground">{stats.revenue}€</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vidéos récentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentVideos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{video.title}</p>
                      <p className="text-sm text-muted-foreground">{video.views} vues • {video.likes} likes</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{video.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formations populaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formations.slice(0, 3).map((formation) => (
                  <div key={formation.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{formation.title}</p>
                      <p className="text-sm text-muted-foreground">{formation.students} étudiants</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{formation.revenue}€</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Gestion des Vidéos</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une vidéo
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Uploader une nouvelle vidéo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Titre de la vidéo</label>
                <Input placeholder="Ex: Introduction au Coran" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <Input placeholder="Description de la vidéo..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fichier vidéo</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Glissez votre vidéo ici ou cliquez pour sélectionner</p>
                  <Button variant="outline" className="mt-2">Choisir un fichier</Button>
                </div>
              </div>
              <Button className="w-full">Publier la vidéo</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mes Vidéos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVideos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.views} vues • {video.likes} likes</p>
                        <p className="text-xs text-muted-foreground">{video.date}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Modifier</Button>
                      <Button variant="outline" size="sm">Supprimer</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'formations' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Gestion des Formations</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle formation
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Créer une nouvelle formation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Titre de la formation</label>
                  <Input placeholder="Ex: Formation Coran Complet" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Prix (€)</label>
                  <Input placeholder="49.99" type="number" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <Input placeholder="Description de la formation..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre de niveaux</label>
                <Input placeholder="3" type="number" />
              </div>
              <Button className="w-full">Créer la formation</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mes Formations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formations.map((formation) => (
                  <div key={formation.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h3 className="font-medium text-foreground">{formation.title}</h3>
                      <p className="text-sm text-muted-foreground">{formation.students} étudiants • {formation.revenue}€ de revenus</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        formation.status === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {formation.status}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Modifier</Button>
                      <Button variant="outline" size="sm">Gérer les niveaux</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Gestion des Étudiants</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Étudiants récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Ahmed Benali', 'Fatima Chahid', 'Omar Benjelloun'].map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{student}</h3>
                        <p className="text-sm text-muted-foreground">Inscrit il y a {index + 1} jour(s)</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Voir profil</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
