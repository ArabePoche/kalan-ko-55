
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useOrderMutation } from '@/hooks/useOrderMutation';
import CheckoutHeader from './checkout/CheckoutHeader';
import DeliveryInfo from './checkout/DeliveryInfo';
import PaymentInfo from './checkout/PaymentInfo';
import OrderItems from './checkout/OrderItems';
import OrderSummary from './checkout/OrderSummary';
import PlaceOrderSection from './checkout/PlaceOrderSection';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const createOrderMutation = useOrderMutation(items, getTotalPrice, clearCart, navigate);

  const handlePlaceOrder = () => {
    console.log('Placing order with items:', items);
    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles à votre panier avant de passer commande.",
        variant: "destructive"
      });
      return;
    }
    createOrderMutation.mutate();
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      <CheckoutHeader itemsCount={items.length} />

      <div className="p-4 space-y-4">
        <DeliveryInfo />
        <PaymentInfo />
        <OrderItems items={items} />
        <OrderSummary items={items} totalPrice={getTotalPrice()} />
        <PlaceOrderSection 
          totalPrice={getTotalPrice()}
          isLoading={createOrderMutation.isPending}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
