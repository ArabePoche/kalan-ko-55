
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserActivityStats from '../UserActivityStats';
import UsersTable from '../UsersTable';
import { UserActivity } from '@/hooks/useUserActivity';

interface AdminUsersTabProps {
  users: UserActivity[] | undefined;
  isLoadingUsers: boolean;
  usersError: Error | null;
}

export default function AdminUsersTab({ users, isLoadingUsers, usersError }: AdminUsersTabProps) {
  return (
    <div className="space-y-4">
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
          {usersError && <p className="text-destructive">Erreur: {usersError.message}</p>}
          {users && <UsersTable users={users} loading={isLoadingUsers} />}
        </CardContent>
      </Card>
    </div>
  );
}
