
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useFormationUpdate = () => {
  const [loading, setLoading] = useState(false);

  const updateFormation = async (formation: any, form: any, onUpdated?: () => void, onClose?: () => void) => {
    setLoading(true);

    console.log("[DEBUG] Starting formation update process");
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log("[DEBUG] Current user for update:", user);
    if (user) {
      const { data: isAdmin, error } = await supabase.rpc('has_role', { user_id: user.id, role: 'admin' });
      console.log('[DEBUG] Admin check from client:', { isAdmin, error });
    }

    if (!form.title || !form.price) {
      toast({
        title: "Champs requis",
        description: "Le titre et le prix sont obligatoires.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const formationId = formation?.id ?? null;
    console.log("[DEBUG] Formation ID for update:", formationId, typeof formationId);
    if (!formationId) {
      toast({
        title: "Erreur technique",
        description: `Impossible de retrouver un id formation valide. Merci de recharger la page ou contacter l'admin.`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
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

      // Préparation du payload pour la formation
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

      console.log("[DEBUG] Payload update formations:", payload);

      // Mise à jour de la formation
      console.log("[DEBUG] Lancement de la requête UPDATE formation...");
      const { error: updateError } = await supabase
        .from("formations")
        .update(payload)
        .eq("id", formationId);

      console.log("[DEBUG] Erreur update formation:", updateError);

      if (updateError) {
        console.error("[DEBUG] Erreur Supabase formation:", updateError);
        toast({
          title: "Erreur lors de la modification",
          description: updateError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Gestion des niveaux et leçons
      console.log("[DEBUG] Starting levels and lessons update...");
      const newLevelsData = form.levels || [];
      console.log("[DEBUG] New levels data:", newLevelsData);

      // 1. Supprimer les anciens niveaux et leçons
      console.log("[DEBUG] Fetching existing levels...");
      const { data: oldLevels, error: getOldLevelsError } = await supabase
        .from('levels')
        .select('id')
        .eq('formation_id', formationId);

      console.log("[DEBUG] Existing levels:", oldLevels);
      if (getOldLevelsError) {
        console.error("[DEBUG] Error fetching old levels:", getOldLevelsError);
        toast({ 
          title: "Erreur technique", 
          description: "Impossible de récupérer les anciens niveaux." 
        });
        setLoading(false);
        return;
      }

      if (oldLevels && oldLevels.length > 0) {
        const oldLevelIds = oldLevels.map(l => l.id);
        console.log("[DEBUG] Deleting lessons for level IDs:", oldLevelIds);

        // Supprimer les leçons d'abord
        const { error: deleteLessonsError } = await supabase
          .from('lessons')
          .delete()
          .in('level_id', oldLevelIds);

        if (deleteLessonsError) {
          console.error("[DEBUG] Error deleting lessons:", deleteLessonsError);
          toast({ 
            title: "Erreur technique", 
            description: "Impossible de supprimer les anciennes leçons." 
          });
          setLoading(false);
          return;
        }
        console.log("[DEBUG] Old lessons deleted successfully");

        // Puis supprimer les niveaux
        const { error: deleteLevelsError } = await supabase
          .from('levels')
          .delete()
          .eq('formation_id', formationId);

        if (deleteLevelsError) {
          console.error("[DEBUG] Error deleting levels:", deleteLevelsError);
          toast({ 
            title: "Erreur technique", 
            description: "Impossible de supprimer les anciens niveaux." 
          });
          setLoading(false);
          return;
        }
        console.log("[DEBUG] Old levels deleted successfully");
      }

      // 2. Insérer les nouveaux niveaux et leçons
      console.log("[DEBUG] Creating new levels and lessons...");
      for (const [levelIndex, levelData] of newLevelsData.entries()) {
        console.log(`[DEBUG] Creating level ${levelIndex + 1}:`, levelData);

        const levelInsertData = {
          title: levelData.title,
          formation_id: formationId,
          order_index: levelIndex + 1,
        };
        console.log("[DEBUG] Level insert data:", levelInsertData);

        const { data: newLevel, error: insertLevelError } = await supabase
          .from('levels')
          .insert(levelInsertData)
          .select('id')
          .single();

        console.log("[DEBUG] Level insert result:", { newLevel, insertLevelError });

        if (insertLevelError) {
          console.error("[DEBUG] Error inserting level:", insertLevelError);
          toast({ 
            title: "Erreur lors de la création du niveau", 
            description: `Erreur à l'ajout du niveau "${levelData.title}": ${insertLevelError.message}` 
          });
          setLoading(false);
          return;
        }

        if (newLevel && levelData.lessons && levelData.lessons.length > 0) {
          console.log(`[DEBUG] Creating ${levelData.lessons.length} lessons for level ${newLevel.id}`);
          
          const lessonsToInsert = levelData.lessons.map((lesson, lessonIndex) => {
            const lessonData = {
              level_id: newLevel.id,
              title: lesson.title,
              video_url: lesson.video_url || null,
              order_index: lessonIndex + 1,
            };
            console.log(`[DEBUG] Lesson ${lessonIndex + 1} data:`, lessonData);
            return lessonData;
          });

          const { error: insertLessonsError } = await supabase
            .from('lessons')
            .insert(lessonsToInsert);

          if (insertLessonsError) {
            console.error("[DEBUG] Error inserting lessons:", insertLessonsError);
            toast({ 
              title: "Erreur lors de la création des leçons", 
              description: `Erreur à l'ajout des leçons: ${insertLessonsError.message}` 
            });
            setLoading(false);
            return;
          }
          console.log(`[DEBUG] Successfully created ${lessonsToInsert.length} lessons`);
        }
      }

      console.log("[DEBUG] All levels and lessons created successfully");

      // Récupération des données mises à jour
      console.log("[DEBUG] Fetching updated formation data...");
      const { data: updatedData, error: selectError } = await supabase
        .from("formations")
        .select("*")
        .eq("id", formationId)
        .single();

      console.log("[DEBUG] Updated formation data:", updatedData);
      if (selectError) {
        console.warn("[DEBUG] Could not fetch updated data:", selectError);
      }

      console.log("[DEBUG] Formation update completed successfully");
      toast({
        title: "Formation modifiée",
        description: "Les changements ont été enregistrés avec succès.",
      });
      
      setLoading(false);
      onClose?.();
      onUpdated?.();

    } catch (error: any) {
      console.error("[DEBUG] Unexpected error during formation update:", error);
      toast({
        title: "Erreur inattendue",
        description: error.message || "Une erreur s'est produite lors de la modification.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return { updateFormation, loading };
};
