
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
import { useAuth } from '@/contexts/AuthProvider';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour passer votre commande.",
      });
      navigate('/auth');
    }
  }, [items, user, authLoading, navigate]);

  const createOrderMutation = useOrderMutation(clearCart, navigate);

  const handlePlaceOrder = () => {
    console.log('=== PLACE ORDER BUTTON CLICKED ===');
    console.log('Items in cart:', items);
    console.log('Total price:', getTotalPrice());
    
    if (items.length === 0) {
      console.log('Cart is empty, showing error');
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles à votre panier avant de passer commande.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Starting order mutation...');
    createOrderMutation.mutate({ items, totalPrice: getTotalPrice() });
  };

  if (authLoading || (!user && items.length > 0)) {
    return null; // Or a loading spinner while we check auth and redirect
  }

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
