
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useFormationUpdate = () => {
  const [loading, setLoading] = useState(false);

  const updateFormation = async (formation: any, formData: any, onSuccess: () => void, onClose: () => void) => {
    setLoading(true);
    console.log('Starting formation update...');
    console.log('Original formation:', formation);
    console.log('Form data to update:', formData);

    try {
      // Préparer les données de base de la formation (exclure les niveaux qui seront traités séparément)
      const { levels, ...formationData } = formData;
      
      console.log('Formation data (without levels):', formationData);
      console.log('Levels data:', levels);

      // 1. Mettre à jour les informations de base de la formation
      const { error: formationError } = await supabase
        .from('formations')
        .update(formationData)
        .eq('id', formation.id);

      if (formationError) {
        console.error('Error updating formation:', formationError);
        throw formationError;
      }

      console.log('Formation updated successfully');

      // 2. Gérer les niveaux et leçons si présents
      if (levels && Array.isArray(levels)) {
        console.log('Processing levels...');
        
        // D'abord, récupérer tous les IDs des niveaux existants pour cette formation
        const { data: existingLevels, error: fetchLevelsError } = await supabase
          .from('levels')
          .select('id')
          .eq('formation_id', formation.id);

        if (fetchLevelsError) {
          console.error('Error fetching existing levels:', fetchLevelsError);
          throw fetchLevelsError;
        }

        const levelIds = existingLevels?.map(level => level.id) || [];
        console.log('Existing level IDs to delete:', levelIds);

        // Supprimer toutes les leçons associées aux niveaux existants
        if (levelIds.length > 0) {
          const { error: deleteLessonsError } = await supabase
            .from('lessons')
            .delete()
            .in('level_id', levelIds);

          if (deleteLessonsError) {
            console.error('Error deleting old lessons:', deleteLessonsError);
            throw deleteLessonsError;
          }

          console.log('Old lessons deleted successfully');

          // Supprimer tous les anciens niveaux
          const { error: deleteLevelsError } = await supabase
            .from('levels')
            .delete()
            .eq('formation_id', formation.id);

          if (deleteLevelsError) {
            console.error('Error deleting old levels:', deleteLevelsError);
            throw deleteLevelsError;
          }

          console.log('Old levels deleted successfully');
        }

        // Créer les nouveaux niveaux
        for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
          const level = levels[levelIndex];
          console.log(`Processing level ${levelIndex}:`, level);
          
          const { data: newLevel, error: levelError } = await supabase
            .from('levels')
            .insert({
              title: level.title,
              description: level.description || null,
              formation_id: formation.id,
              order_index: levelIndex
            })
            .select()
            .single();

          if (levelError) {
            console.error(`Error creating level ${levelIndex}:`, levelError);
            throw levelError;
          }

          console.log(`Level ${levelIndex} created:`, newLevel);

          // Créer les leçons pour ce niveau
          if (level.lessons && Array.isArray(level.lessons)) {
            for (let lessonIndex = 0; lessonIndex < level.lessons.length; lessonIndex++) {
              const lesson = level.lessons[lessonIndex];
              console.log(`Processing lesson ${lessonIndex} for level ${levelIndex}:`, lesson);
              
              const { error: lessonError } = await supabase
                .from('lessons')
                .insert({
                  title: lesson.title,
                  video_url: lesson.video_url || null,
                  description: lesson.description || null,
                  duration: lesson.duration || null,
                  level_id: newLevel.id,
                  order_index: lessonIndex,
                  has_exercise: lesson.has_exercise || false
                });

              if (lessonError) {
                console.error(`Error creating lesson ${lessonIndex}:`, lessonError);
                throw lessonError;
              }

              console.log(`Lesson ${lessonIndex} created successfully`);
            }
          }
        }
      }

      toast({
        title: "Formation mise à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });

      console.log('Formation update completed successfully');
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Error in updateFormation:', error);
      toast({
        title: "Erreur lors de la mise à jour",
        description: error instanceof Error ? error.message : "Une erreur inconnue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateFormation, loading };
};
