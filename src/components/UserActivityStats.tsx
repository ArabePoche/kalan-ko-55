
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { UserActivity } from '@/hooks/useUserActivity';

interface UserActivityStatsProps {
  users: UserActivity[];
}

export default function UserActivityStats({ users }: UserActivityStatsProps) {
  const totalUsers = users.length;
  const onlineUsers = users.filter(user => user.is_online).length;
  const activeUsers = users.filter(user => user.activity_score >= 60).length;
  const newUsersThisWeek = users.filter(user => {
    if (!user.created_at) return false;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(user.created_at) > weekAgo;
  }).length;

  const stats = [
    {
      title: 'Total Utilisateurs',
      value: totalUsers.toString(),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'En ligne maintenant',
      value: onlineUsers.toString(),
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      title: 'Utilisateurs actifs',
      value: activeUsers.toString(),
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Nouveaux (7j)',
      value: newUsersThisWeek.toString(),
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
