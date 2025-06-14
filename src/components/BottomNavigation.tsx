import { Home, ShoppingBag, Bell, User, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { getTotalItems } = useCart();
  
  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'shop', label: 'Boutique', icon: ShoppingBag, hasNotification: getTotalItems() > 0, notificationCount: getTotalItems() },
    { id: 'courses', label: 'Cours', icon: null, isSpecial: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          if (tab.isSpecial) {
            // WhatsApp-style central button
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center"
              >
                <div className={cn(
                  "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-green-500 shadow-lg scale-110"
                    : "bg-green-500 hover:bg-green-600"
                )}>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-green-500" />
                  </div>
                  <div className="absolute top-2 left-3 w-2 h-2 bg-white/30 rounded-full blur-sm"></div>
                </div>
                <span className={cn(
                  "text-xs font-medium mt-1 transition-colors",
                  activeTab === tab.id ? "text-green-500" : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
              </button>
            );
          }

          const Icon = tab.icon!;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                activeTab === tab.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5 mb-1" />
                {tab.hasNotification && tab.notificationCount && tab.notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.notificationCount > 99 ? '99+' : tab.notificationCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
