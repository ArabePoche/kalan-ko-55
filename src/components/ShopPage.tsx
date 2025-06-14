
import { ShoppingCart, Star, Filter, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

const ShopPage = () => {
  const { addToCart, getTotalItems } = useCart();
  const navigate = useNavigate();
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
      {/* Header Amazon-style */}
      <div className="p-4 pt-16 bg-[#232F3E] text-white">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">amazon</h1>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-white">
              <Filter className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Barre de recherche Amazon-style */}
        <div className="flex items-center bg-white rounded-md overflow-hidden max-w-2xl mx-auto lg:mx-0">
          <input 
            type="text" 
            placeholder="Rechercher formations, livres, services..."
            className="flex-1 px-3 py-2 text-black outline-none"
          />
          <Button size="sm" className="bg-[#FF9900] hover:bg-[#FF9900]/90 rounded-none">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-white/80 mt-2 text-sm">Livraison en France</p>
      </div>

      {/* Catégories */}
      <div className="p-4 bg-[#37475A] text-white">
        <div className="flex space-x-4 overflow-x-auto">
          {categories.map((category) => (
            <Button 
              key={category.id}
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedCategory(category.id)}
              className={`text-white whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-white/20 text-white font-semibold' 
                  : 'hover:bg-white/10'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Produits */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Résultats pour "{categories.find(c => c.id === selectedCategory)?.label.toLowerCase()}"
          </h2>
          <span className="text-sm text-muted-foreground">{filteredProducts.length} résultats</span>
        </div>

        {/* Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        onClick={() => handleAddToCart(product)}
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
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
