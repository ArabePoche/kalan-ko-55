
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";

interface FormationDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formation: any | null;
  onDeleted: () => void;
}

export default function FormationDeleteModal({
  open,
  onOpenChange,
  formation,
  onDeleted,
}: FormationDeleteModalProps) {
  const [loading, setLoading] = React.useState(false);

  if (!formation) return null;

  const handleDelete = async () => {
    setLoading(true);

    try {
      console.log("[DEBUG] Starting formation deletion process for ID:", formation.id);

      // 1. Supprimer les leçons d'abord
      const { data: levels, error: getLevelsError } = await supabase
        .from('levels')
        .select('id')
        .eq('formation_id', formation.id);

      if (getLevelsError) {
        console.error("[DEBUG] Error fetching levels:", getLevelsError);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les niveaux de la formation.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (levels && levels.length > 0) {
        const levelIds = levels.map(l => l.id);
        console.log("[DEBUG] Deleting lessons for level IDs:", levelIds);

        const { error: deleteLessonsError } = await supabase
          .from('lessons')
          .delete()
          .in('level_id', levelIds);

        if (deleteLessonsError) {
          console.error("[DEBUG] Error deleting lessons:", deleteLessonsError);
          toast({
            title: "Erreur",
            description: "Impossible de supprimer les leçons de la formation.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // 2. Supprimer les niveaux
        const { error: deleteLevelsError } = await supabase
          .from('levels')
          .delete()
          .eq('formation_id', formation.id);

        if (deleteLevelsError) {
          console.error("[DEBUG] Error deleting levels:", deleteLevelsError);
          toast({
            title: "Erreur",
            description: "Impossible de supprimer les niveaux de la formation.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // 3. Supprimer de la table products si elle existe
      const { error: deleteProductError } = await supabase
        .from('products')
        .delete()
        .eq('id', formation.id);

      if (deleteProductError) {
        console.warn("[DEBUG] Error deleting from products (may not exist):", deleteProductError);
        // On continue même si ça échoue, car le produit pourrait ne pas exister
      }

      // 4. Supprimer la formation
      const { error: deleteFormationError } = await supabase
        .from('formations')
        .delete()
        .eq('id', formation.id);

      if (deleteFormationError) {
        console.error("[DEBUG] Error deleting formation:", deleteFormationError);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la formation.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("[DEBUG] Formation deleted successfully");
      toast({
        title: "Formation supprimée",
        description: "La formation a été supprimée avec succès.",
      });

      onDeleted();
    } catch (error: any) {
      console.error("[DEBUG] Unexpected error during formation deletion:", error);
      toast({
        title: "Erreur inattendue",
        description: error.message || "Une erreur s'est produite lors de la suppression.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            Supprimer la formation
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la formation "{formation.title}" ?
            Cette action est irréversible et supprimera également tous les niveaux et leçons associés.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              Annuler
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
