
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormationMobileHeaderProps {
  title: string;
  instructor: string;
  onOrderClick: () => void;
}

export default function FormationMobileHeader({
  title,
  instructor,
  onOrderClick,
}: FormationMobileHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex-shrink-0 p-3 border-b border-border bg-[#075e54] safe-area-top">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="text-white p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-white text-base truncate">{title}</h2>
          <p className="text-sm text-white/80 truncate">{instructor}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOrderClick}
          className="text-white p-2"
        >
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
