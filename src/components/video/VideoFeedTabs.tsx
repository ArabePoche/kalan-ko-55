
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VideoFeedTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const VideoFeedTabs = ({ activeTab, onTabChange }: VideoFeedTabsProps) => {
  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="bg-black/20 backdrop-blur-sm border-none h-10">
          <TabsTrigger 
            value="videos" 
            className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white border-none px-6 py-2"
          >
            Vidéos
          </TabsTrigger>
          <TabsTrigger 
            value="posts" 
            className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white border-none px-6 py-2"
          >
            Posts
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default VideoFeedTabs;
