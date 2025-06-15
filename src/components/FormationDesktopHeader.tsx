
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock } from "lucide-react";

interface FormationDesktopHeaderProps {
  title: string;
  description: string;
  price: number;
  hasAccess: boolean;
  onOrderClick: () => void;
  onStartTrial: () => void;
}

export default function FormationDesktopHeader({
  title,
  description,
  price,
  hasAccess,
  onOrderClick,
  onStartTrial,
}: FormationDesktopHeaderProps) {
  return (
    <div className="bg-[#202c33] border-b border-[#313d44] px-6 py-3">
      <div className="flex items-center justify-between min-h-[85px] max-h-[140px]">
        <div className="overflow-hidden">
          <h2 className="text-xl font-semibold text-white truncate">{title}</h2>
          <p className="text-[#8696a0] text-sm truncate">{description}</p>
          <p className="text-primary text-base font-bold mt-1">{price}€</p>
        </div>
        <div className="flex space-x-2 ml-2">
          {!hasAccess && (
            <Button
              onClick={onStartTrial}
              variant="outline"
              size="sm"
              className="px-3 py-1 h-8 text-xs"
            >
              <Clock className="w-4 h-4 mr-1" />
              Essai 15min
            </Button>
          )}
          <Button
            onClick={onOrderClick}
            className="bg-primary hover:bg-primary/90 px-3 py-1 h-8 text-xs"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Passer commande
          </Button>
        </div>
      </div>
    </div>
  );
}
