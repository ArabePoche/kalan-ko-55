
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Activity } from 'lucide-react';

interface AdminActivityCardsProps {
  recentActivity: {
    newUsersToday: number;
    recentOrders: number;
    popularVideos: Array<{ id: string; title: string; views_count: number }>;
  } | undefined;
  sessionStats: {
    activeSessions: number;
  } | undefined;
  loadingActivity: boolean;
  loadingSessionStats: boolean;
}

export default function AdminActivityCards({ 
  recentActivity, 
  sessionStats, 
  loadingActivity, 
  loadingSessionStats 
}: AdminActivityCardsProps) {
  return (
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
  );
}
