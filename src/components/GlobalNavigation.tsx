
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface GlobalNavigationProps {
  title?: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

const GlobalNavigation = ({ title, showBackButton = true, children }: GlobalNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ne pas afficher la navigation sur certaines pages spécifiques
  const hideNavigation = ['/auth'].includes(location.pathname);
  
  if (hideNavigation) {
    return null;
  }

  const getDefaultTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Accueil';
    if (path.startsWith('/shop')) return 'Boutique';
    if (path.startsWith('/courses')) return 'Cours';
    if (path.startsWith('/notifications')) return 'Notifications';
    if (path.startsWith('/profile')) return 'Profil';
    if (path.startsWith('/cart')) return 'Panier';
    if (path.startsWith('/checkout')) return 'Commande';
    if (path.startsWith('/formation')) return 'Formation';
    if (path.startsWith('/order')) return 'Commander';
    return 'Retour';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between p-4 pt-6">
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">{title || getDefaultTitle()}</h1>
        </div>
        {children && (
          <div className="flex items-center space-x-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalNavigation;
