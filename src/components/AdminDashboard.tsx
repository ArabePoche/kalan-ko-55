
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, GraduationCap, Plus, List, Users } from "lucide-react";
import FormationCreateForm from "./FormationCreateForm";
import VideoCreateForm from "./VideoCreateForm";
import FormationsList from "./FormationsList";
import VideosList from "./VideosList";
import TeachersAdminPanel from "./TeachersAdminPanel";
import { useCategories } from "@/hooks/useCategories";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<'create' | 'list'>('create');
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  // Hook pour récupérer les formations
  const { data: formations = [], isLoading: loadingFormations, refetch: refetchFormations } = useQuery({
    queryKey: ['admin-formations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Hook pour récupérer les vidéos
  const { data: videos = [], isLoading: loadingVideos, refetch: refetchVideos } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleFormationCreated = () => {
    refetchFormations();
  };

  const handleVideoCreated = () => {
    refetchVideos();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrateur</h1>
          <p className="text-gray-600">Gérez vos formations, vidéos et professeurs</p>
        </div>

        {/* Navigation des sections */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <Button
              variant={activeSection === 'create' ? 'default' : 'outline'}
              onClick={() => setActiveSection('create')}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Créer</span>
            </Button>
            <Button
              variant={activeSection === 'list' ? 'default' : 'outline'}
              onClick={() => setActiveSection('list')}
              className="flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>Gérer</span>
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <Tabs defaultValue="formations" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="formations" className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>Formations & Profs</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>Vidéos</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Gestion Profs</span>
            </TabsTrigger>
          </TabsList>

          {/* Section Formations avec gestion des professeurs intégrée */}
          <TabsContent value="formations">
            {activeSection === 'create' ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5" />
                      <span>Créer une nouvelle formation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormationCreateForm
                      categories={categories}
                      loadingCategories={loadingCategories}
                      onCreated={handleFormationCreated}
                    />
                  </CardContent>
                </Card>
                
                {/* Section intégrée pour ajouter des professeurs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Associer des professeurs aux formations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TeachersAdminPanel />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <List className="w-5 h-5" />
                    <span>Gérer les formations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormationsList
                    formations={formations}
                    loading={loadingFormations}
                    onUpdated={refetchFormations}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Section Vidéos */}
          <TabsContent value="videos">
            {activeSection === 'create' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Créer une nouvelle vidéo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoCreateForm
                    onCreated={handleVideoCreated}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <List className="w-5 h-5" />
                    <span>Gérer les vidéos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideosList
                    videos={videos}
                    loading={loadingVideos}
                    onUpdated={refetchVideos}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Section Profs - Vue d'ensemble globale */}
          <TabsContent value="teachers">
            <TeachersAdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
