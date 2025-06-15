
import { Card, CardContent } from '@/components/ui/card';
import { Video, BookOpen, Users, DollarSign } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    videosCount: number;
    formationsCount: number;
    activeUsersCount: number;
    monthlyRevenue: number;
  } | undefined;
  loading: boolean;
}

export default function AdminStats({ stats, loading }: AdminStatsProps) {
  const statItems = [
    { 
      title: 'Total Vidéos', 
      value: loading ? '...' : stats?.videosCount?.toString() || '0', 
      icon: Video, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Total Formations', 
      value: loading ? '...' : stats?.formationsCount?.toString() || '0', 
      icon: BookOpen, 
      color: 'text-green-600' 
    },
    { 
      title: 'Utilisateurs Actifs', 
      value: loading ? '...' : stats?.activeUsersCount?.toString() || '0', 
      icon: Users, 
      color: 'text-purple-600' 
    },
    { 
      title: 'Revenus ce mois', 
      value: loading ? '...' : `${stats?.monthlyRevenue?.toFixed(0) || '0'}€`, 
      icon: DollarSign, 
      color: 'text-orange-600' 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat) => (
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
