
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useFormationUpdate = () => {
  const [loading, setLoading] = useState(false);

  const updateFormation = async (formation: any, form: any, onUpdated?: () => void, onClose?: () => void) => {
    setLoading(true);

    if (!form.title || !form.price) {
      toast({
        title: "Champs requis",
        description: "Le titre et le prix sont obligatoires.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Vérification et log de l'id
    const formationId = formation?.id ?? null;
    console.log("[DEBUG] id utilisé pour update formation:", formationId, typeof formationId);
    if (!formationId) {
      toast({
        title: "Erreur technique",
        description: `Impossible de retrouver un id formation valide. Merci de recharger la page ou contacter l'admin.`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Préparation du payload
    const payload: Record<string, any> = {
      title: form.title,
      description: form.description ?? null,
      price: form.price !== "" && form.price !== null ? parseFloat(form.price) : null,
      original_price: form.original_price !== "" && form.original_price !== null ? parseFloat(form.original_price) : null,
      image_url: form.image_url ?? null,
      badge: form.badge ?? null,
      rating: form.rating !== "" && form.rating !== null ? parseFloat(form.rating) : 0,
      students_count: form.students_count !== "" && form.students_count !== null ? parseInt(form.students_count) : 0,
      instructor_id: form.instructor_id && form.instructor_id !== "" ? form.instructor_id : null,
      discount_percentage: form.discount_percentage !== "" && form.discount_percentage !== null
        ? parseInt(form.discount_percentage)
        : null,
      duration: form.duration !== "" && form.duration !== null ? parseInt(form.duration) : null,
    };

    // Suppression des champs undefined
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    // Debug visuel côté dev
    console.log("[DEBUG] Payload update formations:", payload);

    // Log : voir la différence avec l'original
    if (formation) {
      const diff = Object.entries(payload).filter(([key, val]) => formation[key] !== val);
      console.log("Comparatif AVANT vs APRES:", { changes: diff });
    }

    // On lance la requête de mise à jour
    const { error, data } = await supabase
      .from("formations")
      .update(payload)
      .eq("id", formationId)
      .select();

    console.log("[DEBUG] Réponse Supabase update:", { error, data });

    if (error) {
      console.error("[DEBUG] Erreur Supabase:", error);
      toast({
        title: "Erreur lors de la modification",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Vérification plus stricte de la réponse
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("[DEBUG] Pas de données retournées:", data);
      toast({
        title: "Aucune modification",
        description: "Aucune donnée n'a été modifiée en base. Vérifiez que les valeurs sont différentes de l'existant.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    console.log("[DEBUG] Modification réussie:", data);
    toast({
      title: "Formation modifiée",
      description: "Les changements ont été enregistrés.",
    });
    setLoading(false);
    onClose?.();
    onUpdated?.();
  };

  return { updateFormation, loading };
};
