import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Globe, Laptop, Smartphone } from 'lucide-react';
import { UserSession } from '@/hooks/useUserSessions';

interface UserSessionsTableProps {
  sessions: UserSession[];
  loading?: boolean;
}

export default function UserSessionsTable({ sessions, loading }: UserSessionsTableProps) {
  if (loading) {
    return <div className="flex justify-center p-4">Chargement des sessions...</div>;
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'En cours';
    if (minutes < 60) return `${Math.round(minutes)}min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationFromIP = (ip: string | null) => {
    // Simulation basique - en réalité, il faudrait une API de géolocalisation
    if (!ip) return 'Inconnue';
    return ip.startsWith('127.') ? 'Local' : 'Externe';
  };

  const getDeviceInfo = (userAgent: string | null) => {
    if (!userAgent) return { device: 'Inconnu', browser: 'Inconnu', os: 'Inconnu' };

    let device = 'Ordinateur';
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      device = 'Mobile';
    }

    let browser = 'Navigateur Inconnu';
    if (userAgent.includes("Firefox/")) browser = 'Firefox';
    else if (userAgent.includes("SamsungBrowser/")) browser = 'Samsung Internet';
    else if (userAgent.includes("Opera/") || userAgent.includes("OPR/")) browser = 'Opera';
    else if (userAgent.includes("Edge/")) browser = 'Edge';
    else if (userAgent.includes("Chrome/")) browser = 'Chrome';
    else if (userAgent.includes("Safari/")) browser = 'Safari';

    let os = 'OS Inconnu';
    if (userAgent.includes("Windows NT")) os = 'Windows';
    else if (userAgent.includes("Macintosh")) os = 'macOS';
    else if (userAgent.includes("Android")) os = 'Android';
    else if (userAgent.includes("Linux")) os = 'Linux';
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = 'iOS';
    
    return { device, browser, os };
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Début de session</TableHead>
          <TableHead>Fin de session</TableHead>
          <TableHead>Durée</TableHead>
          <TableHead className="hidden md:table-cell">Appareil</TableHead>
          <TableHead className="hidden md:table-cell">Localisation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell>
              <div>
                <p className="font-medium">
                  {session.user_profile?.first_name} {session.user_profile?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">@{session.user_profile?.username}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatDateTime(session.started_at)}</span>
              </div>
            </TableCell>
            <TableCell>
              {session.ended_at ? (
                <span className="text-sm">{formatDateTime(session.ended_at)}</span>
              ) : (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  En cours
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge variant={session.ended_at ? "outline" : "default"}>
                  {formatDuration(session.duration_minutes)}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {(() => {
                const info = getDeviceInfo(session.user_agent);
                const DeviceIcon = info.device === 'Mobile' ? Smartphone : Laptop;
                return (
                  <div className="flex items-center gap-2">
                    <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{info.browser}</p>
                      <p className="text-xs text-muted-foreground">{info.os}</p>
                    </div>
                  </div>
                );
              })()}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{getLocationFromIP(session.ip_address)}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
