
import { ShoppingCart, User, Home, BookOpen, Bell, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useCart } from '@/hooks/useCart';

const GlobalNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getTotalItems } = useCart();

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: BookOpen, label: 'Formations', path: '/shop' },
  ];

  const totalItems = getTotalItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-12 flex items-center px-4">
      <div className="flex items-center space-x-6 flex-1">
        <h1 className="text-lg font-bold">MonApp</h1>
        
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate(item.path)}
              className="h-8"
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Bouton Admin visible pour tout le monde. 
          Pour réserver aux admins, il suffit de rajouter par exemple un check: user?.role === 'admin'
        */}
        <Button
          variant={location.pathname === '/admin' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => navigate('/admin')}
          className="h-8 w-8 p-0"
          aria-label="Dashboard Admin"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/notifications')}
          className="h-8 w-8 p-0"
        >
          <Bell className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/cart')}
          className="relative h-8 w-8 p-0"
        >
          <ShoppingCart className="w-4 h-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/profile')}
          className="h-8 w-8 p-0"
        >
          <User className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
};

export default GlobalNavigation;

