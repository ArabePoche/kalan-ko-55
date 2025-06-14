
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import ShopHeader from './shop/ShopHeader';
import CategoryFilter from './shop/CategoryFilter';
import ProductGrid from './shop/ProductGrid';
import { Product } from '@/hooks/useProducts';

const ShopPage = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      instructor: product.instructor || 'Instructeur',
      image: product.image_url || '/placeholder.svg',
      type: product.product_type
    });
    
    toast({
      title: "Ajouté au panier !",
      description: `${product.title} a été ajouté à votre panier.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto bg-background min-h-screen">
      <ShopHeader />
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <ProductGrid 
        onAddToCart={handleAddToCart}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default ShopPage;
