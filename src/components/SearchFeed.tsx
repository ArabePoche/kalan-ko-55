
import { useState } from 'react';
import { Search, Filter, Video, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'videos' | 'posts'>('all');

  const filters = [
    { id: 'all', label: 'Tout', icon: Filter },
    { id: 'videos', label: 'Vidéos', icon: Video },
    { id: 'posts', label: 'Posts', icon: FileText },
  ];

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      <div className="p-4 space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher des vidéos, posts, formations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id as any)}
                className="flex items-center space-x-1"
              >
                <Icon className="w-4 h-4" />
                <span>{filter.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Search Results */}
        <div className="mt-6">
          {searchQuery ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Recherche pour "{searchQuery}"</p>
              <p className="text-sm text-muted-foreground mt-2">
                Les résultats apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Tendances</h3>
              <div className="space-y-2">
                {['Formation Coran', 'Sciences islamiques', 'Langue arabe', 'Hadith'].map((trend) => (
                  <div key={trend} className="p-3 bg-secondary rounded-lg">
                    <p className="text-foreground">{trend}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFeed;
