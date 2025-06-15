
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
    console.log('User:', user);
    console.log('Items in cart:', items);
    console.log('Total price:', getTotalPrice());
    
    if (!user) {
      console.log('User not authenticated');
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour passer votre commande.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (items.length === 0) {
      console.log('Cart is empty, showing error');
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles à votre panier avant de passer commande.",
        variant: "destructive"
      });
      return;
    }

    const totalPrice = getTotalPrice();
    if (totalPrice <= 0) {
      console.log('Invalid total price:', totalPrice);
      toast({
        title: "Erreur de prix",
        description: "Le montant total doit être supérieur à 0€.",
        variant: "destructive"
      });
      return;
    }

    // Validation des articles
    const invalidItems = items.filter(item => !item.id || !item.price || !item.quantity || item.quantity <= 0);
    if (invalidItems.length > 0) {
      console.log('Invalid items found:', invalidItems);
      toast({
        title: "Articles invalides",
        description: "Certains articles de votre panier sont invalides. Veuillez rafraîchir la page.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('All validations passed, starting order mutation...');
    createOrderMutation.mutate({ items, totalPrice });
  };

  if (authLoading || (!user && items.length > 0)) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
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
