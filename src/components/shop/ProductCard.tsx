
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  title: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  students: number;
  image: string;
  type: 'formation' | 'article' | 'service';
  badge?: string;
  discount?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex md:flex-col">
          <div className="relative flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.title}
              className="w-24 h-32 md:w-full md:h-48 object-cover"
            />
            {product.badge && (
              <span className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                {product.badge}
              </span>
            )}
            {product.discount && (
              <span className="absolute top-6 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                {product.discount}
              </span>
            )}
          </div>
          <div className="flex-1 p-3">
            <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
              {product.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-1">{product.instructor}</p>
            <div className="flex items-center space-x-1 mb-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {product.rating} ({product.students})
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-bold text-red-600">{product.price}€</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice}€
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                {product.type === 'formation' ? 'Formation' : 
                 product.type === 'article' ? 'Livre' : 'Service'}
              </span>
              <Button 
                size="sm" 
                onClick={() => onAddToCart(product)}
                className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-black"
              >
                <Plus className="w-3 h-3 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
