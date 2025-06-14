
import { ArrowLeft, CreditCard, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    // Simuler la commande
    toast({
      title: "Commande passée avec succès !",
      description: "Votre commande a été soumise et sera examinée par un administrateur.",
    });
    clearCart();
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
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

      <div className="p-4 space-y-4">
        {/* Adresse de livraison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Adresse de livraison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Pour les formations numériques, l'accès sera fourni directement dans votre compte après validation de la commande.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Méthode de paiement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Méthode de paiement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Paiement après validation :</strong> Le paiement sera traité une fois votre commande approuvée par un administrateur.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Articles commandés */}
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

        {/* Résumé de commande */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé de la commande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Articles ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>{getTotalPrice().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison et traitement</span>
                <span className="text-green-600">Gratuits</span>
              </div>
              <div className="flex justify-between">
                <span>TVA incluse</span>
                <span>{(getTotalPrice() * 0.2).toFixed(2)}€</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg text-red-600">
                <span>Total de la commande</span>
                <span>{getTotalPrice().toFixed(2)}€</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton de commande */}
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
              <Button onClick={handlePlaceOrder} className="w-full bg-[#FF9900] hover:bg-[#FF9900]/90 text-black" size="lg">
                Passer la commande - {getTotalPrice().toFixed(2)}€
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
