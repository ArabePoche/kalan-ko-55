
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

  // Pages qui utilisent le layout avec navigation
  const isMainLayout = ['/', '/shop', '/courses', '/notifications', '/profile'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation globale pour les pages principales */}
      {isMainLayout && (
        <GlobalNavigation showBackButton={false} />
      )}

      {/* Main Content */}
      <div className={`${isMainLayout ? 'pt-16 pb-20' : ''}`}>
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
