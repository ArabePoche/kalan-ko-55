
import { Bell, Clock, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const NotificationsFeed = () => {
  const { notifications, loading, markAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-md mx-auto p-4">
        <div className="text-center py-6">Chargement des notifications...</div>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-primary" /> Notifications
      </h2>
      
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-muted-foreground text-center py-6">
            Aucune notification pour l'instant.
          </div>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all ${
                !notification.is_read ? "border-primary/50 bg-primary/5" : ""
              }`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{notification.title}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(notification.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </div>
                        {!notification.is_read && (
                          <Badge variant="secondary" className="text-xs">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {notification.message}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsFeed;
