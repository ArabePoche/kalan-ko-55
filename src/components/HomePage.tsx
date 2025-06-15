
import { useState } from 'react';
import { cn } from '@/lib/utils';
import VideoFeed from './VideoFeed';
import PostsFeed from './PostsFeed';
import SearchFeed from './SearchFeed';
import PromotionalFormations from './PromotionalFormations';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/use-toast';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'videos' | 'posts' | 'search'>('videos');
  const { addToCart } = useCart();

  const tabs = [
    { id: 'videos', label: 'Vidéos' },
    { id: 'posts', label: 'Posts' },
    { id: 'search', label: 'Recherche' },
  ];

  const handleBuyFormation = (formation: any) => {
    addToCart({
      id: formation.id,
      title: formation.title,
      price: formation.price,
      image: formation.image_url || '/placeholder.svg',
      type: 'formation'
    });
    
    toast({
      title: "Formation ajoutée au panier",
      description: `${formation.title} a été ajoutée à votre panier.`,
    });
  };

  return (
    <div className="h-screen bg-background">
      {/* Transparent Tab Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-center pt-12 pb-4">
          <div className="flex bg-black/30 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/20"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-full">
        {activeTab === 'videos' && (
          <>
            <VideoFeed />
            {/* Formations promotionnelles en overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-40">
              <PromotionalFormations onBuyClick={handleBuyFormation} />
            </div>
          </>
        )}
        {activeTab === 'posts' && (
          <div className="pt-24">
            <PostsFeed />
          </div>
        )}
        {activeTab === 'search' && (
          <div className="pt-24">
            <SearchFeed />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
