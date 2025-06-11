
import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import HomePage from '@/components/HomePage';
import ShopPage from '@/components/ShopPage';
import CoursesPage from '@/components/CoursesPage';
import ProfilePage from '@/components/ProfilePage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'courses':
        return <CoursesPage />;
      case 'notifications':
        return (
          <div className="flex items-center justify-center h-screen">
            <p className="text-muted-foreground">Notifications - En développement</p>
          </div>
        );
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
