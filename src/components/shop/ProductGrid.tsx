import ProductCard from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

interface ProductGridProps {
  onAddToCart: (product: any) => void;
  selectedCategory: string;
  products: any[];
  isLoading: boolean;
}

const ProductGrid = ({ onAddToCart, selectedCategory, products, isLoading }: ProductGridProps) => {
  const { data: categories = [] } = useCategories();

  const selectedCategoryLabel = categories.find(c => c.name === selectedCategory)?.label || 'Tous';

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="animate-pulse bg-gray-200 h-6 w-48 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Résultats pour "{selectedCategoryLabel.toLowerCase()}"
        </h2>
        <span className="text-sm text-muted-foreground">{products.length} résultats</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun produit trouvé dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
