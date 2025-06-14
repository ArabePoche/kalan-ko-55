
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import ShopHeader from './shop/ShopHeader';
import CategoryFilter from './shop/CategoryFilter';
import ProductGrid from './shop/ProductGrid';

const ShopPage = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: '1',
      title: 'Formation Coran Complet',
      instructor: 'Professeur Ahmed',
      price: 49.99,
      originalPrice: 79.99,
      rating: 4.8,
      students: 1234,
      image: '/placeholder.svg',
      type: 'formation' as const,
      badge: 'Bestseller',
      discount: '-38%'
    },
    {
      id: '2',
      title: 'Sciences Islamiques Avancées',
      instructor: 'Dr. Fatima',
      price: 79.99,
      rating: 4.9,
      students: 856,
      image: '/placeholder.svg',
      type: 'formation' as const
    },
    {
      id: '3',
      title: 'Livre: Guide du Musulman',
      instructor: 'Éditions Al-Bouraq',
      price: 24.99,
      rating: 4.7,
      students: 450,
      image: '/placeholder.svg',
      type: 'article' as const,
      badge: 'Nouveau'
    },
    {
      id: '4',
      title: 'Consultation Spirituelle',
      instructor: 'Imam Hassan',
      price: 35.00,
      rating: 4.9,
      students: 89,
      image: '/placeholder.svg',
      type: 'service' as const
    },
    {
      id: '5',
      title: 'Livre: Histoire de l\'Islam',
      instructor: 'Éditions Maison d\'Ennour',
      price: 19.99,
      rating: 4.6,
      students: 320,
      image: '/placeholder.svg',
      type: 'article' as const
    },
    {
      id: '6',
      title: 'Service: Cours particuliers',
      instructor: 'Professeur Youssef',
      price: 45.00,
      rating: 4.8,
      students: 156,
      image: '/placeholder.svg',
      type: 'service' as const
    }
  ];

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'formation', label: 'Formations' },
    { id: 'article', label: 'Livres' },
    { id: 'service', label: 'Services' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.type === selectedCategory);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      instructor: product.instructor,
      image: product.image,
      type: product.type
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
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <ProductGrid 
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        selectedCategory={selectedCategory}
        categories={categories}
      />
    </div>
  );
};

export default ShopPage;
