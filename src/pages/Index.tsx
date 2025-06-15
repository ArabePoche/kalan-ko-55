
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import GlobalNavigation from '@/components/GlobalNavigation';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/shop')) return 'shop';
    if (path.startsWith('/courses')) return 'courses';
    if (path.startsWith('/notifications')) return 'notifications';
    if (path.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const activeTab = getActiveTabFromPath();

  const handleTabChange = (tab: string) => {
    const path = tab === 'home' ? '/' : `/${tab}`;
    navigate(path);
  };

  const isHomePage = location.pathname === '/';
  const isMainLayout = ['/', '/shop', '/courses', '/notifications', '/profile'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation globale pour les pages principales, sauf la page d'accueil */}
      {isMainLayout && !isHomePage && (
        <GlobalNavigation />
      )}

      {/* Main Content - Pas de padding pour la page d'accueil (VideoFeed) */}
      <div className={`${isMainLayout && !isHomePage ? 'pt-12 pb-20' : ''}`}>
        <Outlet />
      </div>

      {/* Bottom Navigation pour les pages principales */}
      {isMainLayout && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

export default Index;
