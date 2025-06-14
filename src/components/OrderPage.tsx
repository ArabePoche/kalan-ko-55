
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const OrderPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  // Mock video data - in real app, fetch based on videoId
  const video = {
    id: videoId,
    title: 'Formation Coran - Niveau Débutant',
    author: 'Professeur Ahmed',
    price: 49.99,
    description: 'Apprenez les bases de la lecture du Coran avec cette formation complète.',
    thumbnail: '/placeholder.svg'
  };

  const handleOrder = () => {
    // Ici, dans la vraie app, on enverrait la commande associée au compte utilisateur connecté
    toast({
      title: "Demande de commande envoyée !",
      description: "Votre demande de commande a été soumise et sera examinée par un administrateur.",
    });
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 pt-16 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Passer une commande</h1>
            <p className="text-primary-foreground/80 text-sm">Approbation manuelle requise</p>
          </div>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-center">
        {/* Formation Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{video.title}</h3>
                <p className="text-sm text-muted-foreground">{video.author}</p>
                <p className="text-lg font-bold text-primary">{video.price}€</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">{video.description}</div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Finaliser ma commande</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <p className="text-sm text-yellow-800">
                <strong>Note :</strong> Votre commande sera associée à votre compte et examinée par un administrateur.<br />
                Un email ou une notification vous sera envoyé(e) une fois la commande approuvée.
              </p>
            </div>
            <Button onClick={handleOrder} className="w-full" size="lg">
              Soumettre ma commande - {video.price}€
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderPage;

