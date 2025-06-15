
import { Bell, Check, CheckCheck, Clock, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const AdminNotifications = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-orange-50 border-orange-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-4xl mx-auto p-4">
        <div className="text-center py-6">Chargement des notifications...</div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Notifications Admin</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} non lues
            </Badge>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune notification pour l'instant.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all ${
                !notification.is_read 
                  ? `${getNotificationColor(notification.type)} shadow-md` 
                  : 'bg-background'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(notification.type)}
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    {!notification.is_read && (
                      <Badge variant="secondary" className="text-xs">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatDistanceToNow(new Date(notification.created_at), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </div>
                    {!notification.is_read && (
                      <Button
                        onClick={() => markAsRead(notification.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-3">{notification.message}</p>
                
                {notification.type === 'order' && notification.order_id && (
                  <div className="bg-background/50 rounded-lg p-3 border">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>ID Commande:</strong> {notification.order_id}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approuver
                      </Button>
                      <Button size="sm" variant="destructive">
                        Rejeter
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
