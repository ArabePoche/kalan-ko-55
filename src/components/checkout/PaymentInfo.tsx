
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentInfo = () => {
  return (
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
  );
};

export default PaymentInfo;
