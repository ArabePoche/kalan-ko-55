
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CheckoutHeaderProps {
  itemsCount: number;
}

const CheckoutHeader = ({ itemsCount }: CheckoutHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 pt-16 bg-[#232F3E] text-white">
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/cart')}
          className="text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Commande</h1>
          <p className="text-white/80 text-sm">Vérifiez et confirmez</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
