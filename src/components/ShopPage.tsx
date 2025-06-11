
import { ShoppingBag, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShopPage = () => {
  const formations = [
    {
      id: '1',
      title: 'Formation Coran Complet',
      instructor: 'Professeur Ahmed',
      price: 49.99,
      rating: 4.8,
      students: 1234,
      image: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'Sciences Islamiques Avancées',
      instructor: 'Dr. Fatima',
      price: 79.99,
      rating: 4.9,
      students: 856,
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="p-4 pt-16 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Boutique</h1>
          <Button variant="ghost" size="sm">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-primary-foreground/80 mt-2">Découvrez nos formations</p>
      </div>

      {/* Formations Grid */}
      <div className="p-4 space-y-4">
        {formations.map((formation) => (
          <div key={formation.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <img 
              src={formation.image} 
              alt={formation.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-1">{formation.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{formation.instructor}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{formation.rating}</span>
                  <span className="text-sm text-muted-foreground">({formation.students})</span>
                </div>
                <span className="text-lg font-bold text-primary">{formation.price}€</span>
              </div>
              <Button className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Acheter maintenant
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
