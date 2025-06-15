
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PlaceOrderSectionProps {
  totalPrice: number;
  isLoading: boolean;
  onPlaceOrder: () => void;
}

const PlaceOrderSection = ({ totalPrice, isLoading, onPlaceOrder }: PlaceOrderSectionProps) => {
  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-yellow-800">
            <User className="w-5 h-5" />
            <span className="font-medium">Commande liée à votre compte</span>
          </div>
          <p className="text-sm text-yellow-700">
            En passant cette commande, vous acceptez nos conditions de vente. 
            Votre commande sera examinée et vous recevrez une confirmation.
          </p>
          <Button 
            onClick={onPlaceOrder} 
            className="w-full bg-[#FF9900] hover:bg-[#FF9900]/90 text-black" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Traitement...' : `Passer la commande - ${totalPrice.toFixed(2)}€`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceOrderSection;
