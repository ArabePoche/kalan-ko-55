
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserSessionsTable from '../UserSessionsTable';
import { UserSession } from '@/hooks/useUserSessions';

interface AdminSessionsTabProps {
  userSessions: UserSession[] | undefined;
  loadingSessions: boolean;
}

export default function AdminSessionsTab({ userSessions, loadingSessions }: AdminSessionsTabProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
