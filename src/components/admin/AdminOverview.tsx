
import AdminStats from './AdminStats';
import AdminSessionStats from './AdminSessionStats';
import AdminActivityCards from './AdminActivityCards';

interface AdminOverviewProps {
  adminStats: any;
  sessionStats: any;
  recentActivity: any;
  loadingStats: boolean;
  loadingSessionStats: boolean;
  loadingActivity: boolean;
}

export default function AdminOverview({
  adminStats,
  sessionStats,
  recentActivity,
  loadingStats,
  loadingSessionStats,
  loadingActivity
}: AdminOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrateur</h1>
        <p className="text-muted-foreground">Gérez vos contenus et suivez vos performances</p>
      </div>

      <AdminStats stats={adminStats} loading={loadingStats} />
      
      <AdminSessionStats sessionStats={sessionStats} loading={loadingSessionStats} />

      <AdminActivityCards 
        recentActivity={recentActivity}
        sessionStats={sessionStats}
        loadingActivity={loadingActivity}
        loadingSessionStats={loadingSessionStats}
      />
    </div>
  );
}
