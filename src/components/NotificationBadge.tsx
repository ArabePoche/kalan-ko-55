
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge = ({ className }: NotificationBadgeProps) => {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate('/admin/notifications')}
      className={`relative ${className}`}
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationBadge;
