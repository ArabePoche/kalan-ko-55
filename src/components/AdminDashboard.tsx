import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Video, BookOpen, Users, Upload, Eye, TrendingUp, DollarSign, MoreHorizontal, Youtube, Clock, Activity } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import FormationsList from "./FormationsList";
import FormationCreateForm from "./FormationCreateForm";
import VideoCreateForm from "./VideoCreateForm";
import UsersTable from "./UsersTable";
import UserSessionsTable from "./UserSessionsTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserActivityStats from "./UserActivityStats";
import { useUserActivity } from "@/hooks/useUserActivity";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useUserSessions, useUserSessionStats } from "@/hooks/useUserSessions";

// Charger les catégories depuis Supabase
const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, label')
    .order('name');
  if (error) throw new Error(error.message);
  return data;
};

const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Fonction de chargement des formations depuis Supabase :
const fetchFormations = async () => {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [newVideo, setNewVideo] = useState({ 
    title: '', 
    description: '', 
    price: '', 
    url: '', 
    categoryId: '', // Ajouté
    videoType: 'promo', // Ajouté
  });
  const [newFormation, setNewFormation] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    promoVideoUrl: '',
    badge: '',
    image_url: '',
    rating: '',
    students_count: '',
    instructor_id: '',
    category_id: '',
    discount_percentage: '',
    duration: ''
  });
  const [isCreatingFormation, setIsCreatingFormation] = useState(false);

  const { data: categories, isLoading: loadingCategories, error: categoryError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: users, isLoading: isLoadingUsers, error: usersError } = useUserActivity();

  const { data: formations, isLoading: loadingFormations, error: formationError, refetch: refetchFormations } = useQuery({
    queryKey: ['admin-formations'],
    queryFn: fetchFormations
  });

  // Nouveaux hooks pour les données réelles
  const { data: adminStats, isLoading: loadingStats } = useAdminStats();
  const { data: recentActivity, isLoading: loadingActivity } = useRecentActivity();
  const { data: userSessions, isLoading: loadingSessions } = useUserSessions();
  const { data: sessionStats, isLoading: loadingSessionStats } = useUserSessionStats();

  // Stats avec données réelles
  const stats = [
    { 
      title: 'Total Vidéos', 
      value: loadingStats ? '...' : adminStats?.videosCount?.toString() || '0', 
      icon: Video, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Total Formations', 
      value: loadingStats ? '...' : adminStats?.formationsCount?.toString() || '0', 
      icon: BookOpen, 
      color: 'text-green-600' 
    },
    { 
      title: 'Utilisateurs Actifs', 
      value: loadingStats ? '...' : adminStats?.activeUsersCount?.toString() || '0', 
      icon: Users, 
      color: 'text-purple-600' 
    },
    { 
      title: 'Revenus ce mois', 
      value: loadingStats ? '...' : `${adminStats?.monthlyRevenue?.toFixed(0) || '0'}€`, 
      icon: DollarSign, 
      color: 'text-orange-600' 
    }
  ];

  const videos = [
    { id: '1', title: 'Introduction au Coran', views: 1234, status: 'Publié' },
    { id: '2', title: 'Règles de Tajwid', views: 856, status: 'En révision' }
  ];

  // Nouvelle fonction pour ajouter une formation (corrigée pour FK products)
  const handleCreateFormation = async () => {
    setIsCreatingFormation(true);
    try {
      if (!newFormation.title || !newFormation.description || !newFormation.price) {
        toast({
          title: "Champs manquants",
          description: "Veuillez renseigner tous les champs obligatoires.",
          variant: "destructive"
        });
        setIsCreatingFormation(false);
        return;
      }
      // Génération d'un id unique partagé
      const id = crypto.randomUUID();

      // Étape 1 : création du produit (typage correct !)
      const productInsert = {
        id,
        title: newFormation.title,
        description: newFormation.description,
        price: newFormation.price ? parseFloat(newFormation.price) : 0,
        original_price: newFormation.original_price
          ? parseFloat(newFormation.original_price)
          : null,
        badge: newFormation.badge || null,
        image_url: newFormation.image_url || null,
        rating: newFormation.rating ? parseFloat(newFormation.rating) : 0,
        students_count: newFormation.students_count
          ? parseInt(newFormation.students_count)
          : 0,
        instructor_id: newFormation.instructor_id || null,
        category_id: newFormation.category_id || null,
        discount_percentage: newFormation.discount_percentage
          ? parseInt(newFormation.discount_percentage)
          : null,
        promo_video_url: newFormation.promoVideoUrl || null,
        // Correction ici : respecter l’enum du type Supabase
        product_type: "formation" as "formation",
        is_active: true,
      };

      const { error: productError } = await supabase
        .from('products')
        .insert([productInsert]);
      if (productError) {
        toast({
          title: "Erreur création produit",
          description: productError.message,
          variant: "destructive"
        });
        setIsCreatingFormation(false);
        return;
      }

      // Étape 2 : création de la formation, sur le même id
      const toInsert = {
        id,
        title: newFormation.title,
        description: newFormation.description,
        price: newFormation.price ? parseFloat(newFormation.price) : null,
        author_id: newFormation.instructor_id || null,
        thumbnail_url: newFormation.image_url || null,
        video_promo_id: newFormation.promoVideoUrl || null,
        category: newFormation.category_id || null,
        duration: newFormation.duration ? parseInt(newFormation.duration) : null,
        badge: newFormation.badge || null,
        category_id: newFormation.category_id || null,
        promo_video_url: newFormation.promoVideoUrl || null,
        image_url: newFormation.image_url || null,
        rating: newFormation.rating ? parseFloat(newFormation.rating) : 0,
        students_count: newFormation.students_count ? parseInt(newFormation.students_count) : 0,
        original_price: newFormation.original_price
          ? parseFloat(newFormation.original_price)
          : null,
        discount_percentage: newFormation.discount_percentage
          ? parseInt(newFormation.discount_percentage)
          : null,
        is_active: true,
      };

      const { error } = await supabase.from('formations').insert([toInsert]);
      if (error) {
        toast({
          title: "Erreur formation",
          description: error.message,
          variant: "destructive"
        });
        setIsCreatingFormation(false);
        return;
      }
      toast({
        title: "Formation créée",
        description: "La formation a bien été ajoutée.",
      });
      setNewFormation({
        title: '',
        description: '',
        price: '',
        original_price: '',
        promoVideoUrl: '',
        badge: '',
        image_url: '',
        rating: '',
        students_count: '',
        instructor_id: '',
        category_id: '',
        discount_percentage: '',
        duration: ''
      });
      await refetchFormations();
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e.message || "Une erreur s'est produite.",
        variant: "destructive"
      });
    }
    setIsCreatingFormation(false);
  };

  // Ajout : Création d'une vidéo avec catégorie et type
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const handleCreateVideo = async () => {
    setIsCreatingVideo(true);
    try {
      if (!newVideo.title || !newVideo.url || !newVideo.categoryId || !newVideo.videoType) {
        toast({
          title: "Champs manquants",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive"
        });
        setIsCreatingVideo(false);
        return;
      }
      // Force typing pour video_type
      const videoType =
        newVideo.videoType === "promo"
          ? "promo"
          : newVideo.videoType === "educational"
            ? "educational"
            : "testimonial";
      const { error } = await supabase
        .from('videos')
        .insert([
          {
            title: newVideo.title,
            description: newVideo.description || null,
            video_url: newVideo.url,
            video_type: videoType,
            category_id: newVideo.categoryId,
            is_active: true,
          }
        ]);
      if (error) {
        toast({
          title: "Erreur lors de la création",
          description: error.message || "Impossible de créer la vidéo.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Vidéo créée",
          description: "La vidéo a bien été ajoutée.",
        });
        setNewVideo({ title: '', description: '', price: '', url: '', categoryId: '', videoType: 'promo' });
      }
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e.message || "Une erreur s'est produite.",
        variant: "destructive"
      });
    }
    setIsCreatingVideo(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header d'abord */}
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrateur</h1>
        <p className="text-muted-foreground">Gérez vos contenus et suivez vos performances</p>
      </div>
      {/* Tabs juste sous le header */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="videos">Gestion Vidéos</TabsTrigger>
          <TabsTrigger value="formations">Gestion Formations</TabsTrigger>
          <TabsTrigger value="users">Gestion Utilisateurs</TabsTrigger>
          <TabsTrigger value="sessions">Sessions Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Le header et les stats sont maintenant à l'intérieur du tab "Vue d'ensemble" */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard Administrateur</h1>
            <p className="text-muted-foreground">Gérez vos contenus et suivez vos performances</p>
          </div>

          {/* Stats Cards avec données réelles */}
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

          {/* Stats de sessions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Sessions actives</p>
                    <p className="text-2xl font-bold text-foreground">
                      {loadingSessionStats ? '...' : sessionStats?.activeSessions || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Temps moyen/session</p>
                    <p className="text-2xl font-bold text-foreground">
                      {loadingSessionStats ? '...' : `${sessionStats?.avgSessionTime || 0}min`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Sessions aujourd'hui</p>
                    <p className="text-2xl font-bold text-foreground">
                      {loadingSessionStats ? '...' : sessionStats?.todaySessionsCount || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm">
                      {loadingActivity ? 'Chargement...' : `${recentActivity?.newUsersToday || 0} nouveaux utilisateurs aujourd'hui`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      {loadingActivity ? 'Chargement...' : `${recentActivity?.recentOrders || 0} commandes dans les dernières 24h`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      {loadingSessionStats ? 'Chargement...' : `${sessionStats?.activeSessions || 0} utilisateurs en ligne`}
                    </span>
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
                  {loadingActivity ? (
                    <p className="text-sm text-muted-foreground">Chargement...</p>
                  ) : (
                    recentActivity?.popularVideos.map((video) => (
                      <div key={video.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{video.title}</span>
                        <Badge variant="secondary">{video.views_count} vues</Badge>
                      </div>
                    ))
                  )}
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
            <CardContent>
              <VideoCreateForm
                categories={categories || []}
                loadingCategories={!!loadingCategories}
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
            <CardContent>
              <FormationCreateForm
                categories={categories || []}
                loadingCategories={!!loadingCategories}
                onCreated={refetchFormations}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Formations Existantes</CardTitle>
            </CardHeader>
            <CardContent>
              <FormationsList
                formations={formations as any[]}
                loading={loadingFormations}
                error={formationError instanceof Error ? formationError : null}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gestion des Utilisateurs</h2>
          </div>
          
          {users && <UserActivityStats users={users} />}
          
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs de la plateforme</CardTitle>
              <p className="text-sm text-muted-foreground">
                Visualisez l'activité et gérez les utilisateurs de la plateforme.
              </p>
            </CardHeader>
            <CardContent>
              {isLoadingUsers && <p>Chargement des utilisateurs...</p>}
              {usersError instanceof Error && <p className="text-destructive">Erreur: {usersError.message}</p>}
              {users && <UsersTable users={users} loading={isLoadingUsers} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sessions Utilisateurs</h2>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sessions utilisateurs en temps réel</CardTitle>
              <p className="text-sm text-muted-foreground">
                Suivez les connexions et la durée des sessions de vos utilisateurs.
              </p>
            </CardHeader>
            <CardContent>
              <UserSessionsTable sessions={userSessions || []} loading={loadingSessions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
