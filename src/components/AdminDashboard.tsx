
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useUserActivity } from "@/hooks/useUserActivity";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useUserSessions, useUserSessionStats } from "@/hooks/useUserSessions";
import { useSessionSimulator } from "@/hooks/useSessionSimulator";
import AdminOverview from './admin/AdminOverview';
import AdminVideosTab from './admin/AdminVideosTab';
import AdminFormationsTab from './admin/AdminFormationsTab';
import AdminUsersTab from './admin/AdminUsersTab';
import AdminSessionsTab from './admin/AdminSessionsTab';

// Charger les catégories depuis Supabase
const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, label')
    .order('name');
  if (error) throw new Error(error.message);
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

  // Utiliser le simulateur de session pour créer une session active
  useSessionSimulator();

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: users, isLoading: isLoadingUsers, error: usersError } = useUserActivity();

  const { data: formations, isLoading: loadingFormations, error: formationError, refetch: refetchFormations } = useQuery({
    queryKey: ['admin-formations'],
    queryFn: fetchFormations
  });

  // Hooks pour les données réelles
  const { data: adminStats, isLoading: loadingStats } = useAdminStats();
  const { data: recentActivity, isLoading: loadingActivity } = useRecentActivity();
  const { data: userSessions, isLoading: loadingSessions } = useUserSessions();
  const { data: sessionStats, isLoading: loadingSessionStats } = useUserSessionStats();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrateur</h1>
        <p className="text-muted-foreground">Gérez vos contenus et suivez vos performances</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="videos">Gestion Vidéos</TabsTrigger>
          <TabsTrigger value="formations">Gestion Formations</TabsTrigger>
          <TabsTrigger value="users">Gestion Utilisateurs</TabsTrigger>
          <TabsTrigger value="sessions">Sessions Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AdminOverview
            adminStats={adminStats}
            sessionStats={sessionStats}
            recentActivity={recentActivity}
            loadingStats={loadingStats}
            loadingSessionStats={loadingSessionStats}
            loadingActivity={loadingActivity}
          />
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <AdminVideosTab
            categories={categories || []}
            loadingCategories={loadingCategories}
          />
        </TabsContent>

        <TabsContent value="formations" className="space-y-4">
          <AdminFormationsTab
            categories={categories || []}
            loadingCategories={loadingCategories}
            formations={formations as any[]}
            loadingFormations={loadingFormations}
            formationError={formationError instanceof Error ? formationError : null}
            refetchFormations={refetchFormations}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <AdminUsersTab
            users={users}
            isLoadingUsers={isLoadingUsers}
            usersError={usersError instanceof Error ? usersError : null}
          />
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <AdminSessionsTab
            userSessions={userSessions}
            loadingSessions={loadingSessions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
