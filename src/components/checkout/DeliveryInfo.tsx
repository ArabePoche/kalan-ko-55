
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DeliveryInfo = () => {
  return (
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
  );
};

export default DeliveryInfo;
