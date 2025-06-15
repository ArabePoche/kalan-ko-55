import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import ShopHeader from './shop/ShopHeader';
import CategoryFilter from './shop/CategoryFilter';
import ProductGrid from './shop/ProductGrid';
import { Product } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

const ShopPage = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour ajouter des articles au panier.",
      });
      navigate('/auth');
      return;
    }

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      instructor: product.instructor,
      image: product.image,
      type: product.type
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
