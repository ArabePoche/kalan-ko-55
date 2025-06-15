
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/types/cart';

interface OrderItemsProps {
  items: CartItem[];
}

const OrderItems = ({ items }: OrderItemsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos articles ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex space-x-3 pb-3 border-b last:border-b-0">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.instructor}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    Qté: {item.quantity}
                  </span>
                  <span className="font-bold text-primary">{item.price}€</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItems;
