
import ProductCard from './ProductCard';

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

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  selectedCategory: string;
  categories: { id: string; label: string; }[];
}

const ProductGrid = ({ products, onAddToCart, selectedCategory, categories }: ProductGridProps) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Résultats pour "{categories.find(c => c.id === selectedCategory)?.label.toLowerCase()}"
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
