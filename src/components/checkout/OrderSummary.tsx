
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/types/cart';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

const OrderSummary = ({ items, totalPrice }: OrderSummaryProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé de la commande</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Articles ({totalItems})</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison et traitement</span>
            <span className="text-green-600">Gratuits</span>
          </div>
          <div className="flex justify-between">
            <span>TVA incluse</span>
            <span>{(totalPrice * 0.2).toFixed(2)}€</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg text-red-600">
            <span>Total de la commande</span>
            <span>{totalPrice.toFixed(2)}€</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
