
import React, { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import FormationBasicFields from "./formation-edit/FormationBasicFields";
import FormationPricingFields from "./formation-edit/FormationPricingFields";
import FormationMetadataFields from "./formation-edit/FormationMetadataFields";
import LevelsAndLessonsSection from "./formation-edit/LevelsAndLessonsSection";
import { useFormationUpdate } from "@/hooks/useFormationUpdate";

interface LessonForm {
  title: string;
  video_url: string;
  description?: string;
  duration?: string;
  has_exercise?: boolean;
}

interface LevelForm {
  title: string;
  description?: string;
  lessons: LessonForm[];
}

interface FormationEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formation: any | null;
  onUpdated: () => void;
}

export default function FormationEditModal({
  open,
  onOpenChange,
  formation,
  onUpdated,
}: FormationEditModalProps) {
  const [form, setForm] = useState<any>(() => ({ ...formation }));
  const [levels, setLevels] = useState<LevelForm[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { updateFormation, loading } = useFormationUpdate();

  // Hydrater à chaque sélection de formation
  React.useEffect(() => {
    if (formation) {
      console.log('Loading formation data:', formation);
      
      // Charger les données de base de la formation
      setForm({ ...formation });
      
      // Charger les niveaux et leçons avec gestion des cas où ils sont déjà présents
      const formationLevels = formation.levels || [];
      console.log('Formation levels:', formationLevels);
      
      const mappedLevels = formationLevels.map((level: any) => ({
        title: level.title || '',
        description: level.description || '',
        lessons: (level.lessons || []).map((lesson: any) => ({
          title: lesson.title || '',
          video_url: lesson.video_url || '',
          description: lesson.description || '',
          duration: lesson.duration || '',
          has_exercise: lesson.has_exercise || false,
        }))
      }));
      
      console.log('Mapped levels for editing:', mappedLevels);
      setLevels(mappedLevels);
      setIsDataLoaded(true);
    } else {
      // Réinitialiser si pas de formation
      setForm({});
      setLevels([]);
      setIsDataLoaded(false);
    }
  }, [formation]);

  if (!formation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting formation update...');
    console.log('Form data:', form);
    console.log('Levels data:', levels);

    // On fusionne les niveaux/leçons dans le formulaire juste avant update
    const fullForm = { ...form, levels };
    console.log('Full form data to submit:', fullForm);

    await updateFormation(formation, fullForm, onUpdated, () => onOpenChange(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la formation</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la formation ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        {!isDataLoaded ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Chargement des données...</p>
            </div>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={handleSubmit} style={{ height: "70vh", maxHeight: "70vh" }}>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3">
                <FormationBasicFields form={form} setForm={setForm} loading={loading} />
                <FormationPricingFields form={form} setForm={setForm} loading={loading} />
                <FormationMetadataFields form={form} setForm={setForm} loading={loading} />
                <LevelsAndLessonsSection levels={levels} setLevels={setLevels} loading={loading} />
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={loading}>
                  Annuler
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
