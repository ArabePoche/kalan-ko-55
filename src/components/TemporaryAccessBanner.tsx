
import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TemporaryAccessBannerProps {
  timeLeft: number; // en minutes
  onExpired: () => void;
}

const TemporaryAccessBanner = ({ timeLeft, onExpired }: TemporaryAccessBannerProps) => {
  const [currentTimeLeft, setCurrentTimeLeft] = useState(timeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeLeft(prev => {
        const newTime = prev - (1/60); // Décrément par seconde
        if (newTime <= 0) {
          onExpired();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpired]);

  const minutes = Math.floor(currentTimeLeft);
  const seconds = Math.floor((currentTimeLeft - minutes) * 60);

  const isLowTime = currentTimeLeft < 5;

  return (
    <Card className={`mb-4 border-2 ${isLowTime ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}`}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-2">
          {isLowTime ? (
            <AlertCircle className="w-5 h-5 text-red-600" />
          ) : (
            <Clock className="w-5 h-5 text-orange-600" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${isLowTime ? 'text-red-800' : 'text-orange-800'}`}>
              Accès temporaire - Temps restant: {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
            <p className={`text-xs ${isLowTime ? 'text-red-600' : 'text-orange-600'}`}>
              {isLowTime 
                ? "Votre temps d'accès expire bientôt. Passez commande pour continuer."
                : "Cet accès expirera automatiquement. Passez commande pour un accès complet."
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemporaryAccessBanner;
