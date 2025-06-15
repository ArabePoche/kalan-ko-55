
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Clock, TrendingUp } from 'lucide-react';

interface AdminSessionStatsProps {
  sessionStats: {
    activeSessions: number;
    avgSessionTime: number;
    todaySessionsCount: number;
  } | undefined;
  loading: boolean;
}

export default function AdminSessionStats({ sessionStats, loading }: AdminSessionStatsProps) {
  const stats = [
    {
      title: 'Sessions actives',
      value: loading ? '...' : sessionStats?.activeSessions?.toString() || '0',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Temps moyen/session',
      value: loading ? '...' : `${sessionStats?.avgSessionTime || 0}min`,
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Sessions aujourd\'hui',
      value: loading ? '...' : sessionStats?.todaySessionsCount?.toString() || '0',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
  );
}
