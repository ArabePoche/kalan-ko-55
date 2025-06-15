
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Circle, Clock, Activity } from 'lucide-react';
import { UserActivity } from '@/hooks/useUserActivity';

interface UsersTableProps {
  users: UserActivity[];
  loading?: boolean;
}

export default function UsersTable({ users, loading }: UsersTableProps) {
  if (loading) {
    return <div className="flex justify-center p-4">Chargement des utilisateurs...</div>;
  }

  const formatLastSeen = (lastSignIn: string) => {
    const now = new Date();
    const lastSignInDate = new Date(lastSignIn);
    const diffInHours = Math.floor((now.getTime() - lastSignInDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  };

  const formatSessionTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  const getActivityLevel = (score: number) => {
    if (score >= 80) return { label: 'Très actif', color: 'bg-green-500' };
    if (score >= 60) return { label: 'Actif', color: 'bg-blue-500' };
    if (score >= 40) return { label: 'Modéré', color: 'bg-yellow-500' };
    return { label: 'Peu actif', color: 'bg-gray-500' };
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Activité</TableHead>
          <TableHead className="hidden md:table-cell">Sessions aujourd'hui</TableHead>
          <TableHead className="hidden md:table-cell">Temps total</TableHead>
          <TableHead className="hidden md:table-cell">Dernière connexion</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const activity = getActivityLevel(user.activity_score);
          
          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.avatar_url ?? undefined} />
                      <AvatarFallback>
                        {user.first_name?.[0]?.toUpperCase() ?? ''}
                        {user.last_name?.[0]?.toUpperCase() ?? ''}
                      </AvatarFallback>
                    </Avatar>
                    {user.is_online && (
                      <Circle className="absolute -bottom-1 -right-1 w-3 h-3 fill-green-500 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.first_name} {user.last_name}
                      {user.is_online && (
                        <span className="ml-2 text-xs text-green-600 font-normal">• En ligne</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${activity.color}`} />
                  <span className="text-sm">{activity.label}</span>
                  <span className="text-xs text-muted-foreground">({user.activity_score})</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.sessions_today}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatSessionTime(user.total_session_time)}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-sm">
                  {user.last_sign_in_at ? formatLastSeen(user.last_sign_in_at) : 'Jamais'}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                    <DropdownMenuItem>Voir les sessions</DropdownMenuItem>
                    <DropdownMenuItem>Changer le rôle</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Suspendre l'utilisateur
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
