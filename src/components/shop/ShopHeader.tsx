import { Filter, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ShopHeader = () => {
  const { getTotalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
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
            {user && getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </div>
      </div>
      
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
  );
};

export default ShopHeader;
