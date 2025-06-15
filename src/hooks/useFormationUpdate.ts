
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

    // Vérifier d'abord si la formation existe
    console.log("[DEBUG] Vérification existence de la formation...");
    const { data: existingFormation, error: checkError } = await supabase
      .from("formations")
      .select("id, title, description, price")
      .eq("id", formationId)
      .single();

    console.log("[DEBUG] Formation existante:", existingFormation);
    console.log("[DEBUG] Erreur de vérification:", checkError);

    if (checkError || !existingFormation) {
      console.error("[DEBUG] Formation non trouvée:", checkError);
      toast({
        title: "Formation introuvable",
        description: `La formation avec l'ID ${formationId} n'existe pas en base de données.`,
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

    // Tentative d'update sans .select() d'abord pour éviter l'erreur 406
    console.log("[DEBUG] Lancement de la requête UPDATE (sans select)...");
    const { error: updateError } = await supabase
      .from("formations")
      .update(payload)
      .eq("id", formationId);

    console.log("[DEBUG] Erreur update (sans select):", updateError);

    if (updateError) {
      console.error("[DEBUG] Erreur Supabase:", updateError);
      toast({
        title: "Erreur lors de la modification",
        description: updateError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Si l'update a réussi, on récupère les données modifiées
    console.log("[DEBUG] Update réussi, récupération des données...");
    const { data: updatedData, error: selectError } = await supabase
      .from("formations")
      .select("*")
      .eq("id", formationId)
      .single();

    console.log("[DEBUG] Données récupérées après update:", updatedData);
    console.log("[DEBUG] Erreur select après update:", selectError);

    if (selectError) {
      // L'update a réussi mais on ne peut pas récupérer les données
      // Ce n'est pas bloquant
      console.warn("[DEBUG] Impossible de récupérer les données après update:", selectError);
    }

    console.log("[DEBUG] Modification réussie");
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
