
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Formation {
  id: string;
  title: string;
  description: string | null;
  price: number;
  promo_video_url: string | null;
  image_url: string | null;
  badge: string | null;
  rating: number | null;
  students_count: number | null;
  instructor: string;
}

const fetchPromotionalFormations = async (): Promise<Formation[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      profiles:instructor_id (
        first_name,
        last_name,
        username
      )
    `)
    .eq('product_type', 'formation')
    .eq('is_active', true)
    .not('promo_video_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw error;

  return data.map(formation => ({
    ...formation,
    instructor: formation.profiles?.[0] ? 
      `${formation.profiles[0].first_name || ''} ${formation.profiles[0].last_name || ''}`.trim() || 
      formation.profiles[0].username || 'Instructeur' 
      : 'Instructeur'
  }));
};

interface PromotionalFormationsProps {
  onBuyClick: (formation: Formation) => void;
}

const PromotionalFormations = ({ onBuyClick }: PromotionalFormationsProps) => {
  const { data: formations = [], isLoading, error } = useQuery({
    queryKey: ['promotional-formations'],
    queryFn: fetchPromotionalFormations
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Formations en vedette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
              <div className="bg-gray-200 h-4 w-3/4 rounded mb-1"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || formations.length === 0) {
    return null;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-white">Formations en vedette</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formations.map((formation) => (
          <Card key={formation.id} className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20 shadow-lg h-96 flex flex-col">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="relative">
                {/* Video promotional */}
                {formation.promo_video_url && (
                  <div className="relative h-32 bg-black rounded-t-lg overflow-hidden">
                    <iframe
                      src={formation.promo_video_url}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Vidéo promotionnelle - ${formation.title}`}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Badge */}
                {formation.badge && (
                  <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                    {formation.badge}
                  </Badge>
                )}
              </div>

              <div className="p-3 bg-white/5 backdrop-blur flex flex-col flex-1">
                <h3 className="font-semibold text-white text-base mb-1 line-clamp-2">
                  {formation.title}
                </h3>
                
                <p className="text-gray-200 text-xs mb-2">{formation.instructor}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-400">{formation.price}€</span>
                    {formation.rating && (
                      <span className="text-xs text-gray-300">
                        ⭐ {formation.rating}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bouton acheter repositionné plus haut */}
                <Button
                  onClick={() => onBuyClick(formation)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 shadow-lg border-0 mb-2"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Acheter - {formation.price}€
                </Button>

                {/* Description en bas, optionnelle */}
                {formation.description && (
                  <p className="text-gray-300 text-xs line-clamp-2 flex-1">
                    {formation.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromotionalFormations;
