
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';

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

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
