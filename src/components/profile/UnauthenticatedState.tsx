
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export const UnauthenticatedState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
      <p className="text-lg mb-4">Vous n'êtes pas connecté.</p>
      <p className="text-muted-foreground mb-6">Connectez-vous pour accéder à votre profil.</p>
      <Button asChild>
        <Link to="/auth">Se connecter / S'inscrire</Link>
      </Button>
    </div>
  );
};
