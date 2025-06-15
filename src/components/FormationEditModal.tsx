
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
}

interface LevelForm {
  title: string;
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
  const { updateFormation, loading } = useFormationUpdate();

  // Hydrater à chaque sélection
  React.useEffect(() => {
    setForm(formation ? { ...formation } : {});
    setLevels(formation?.levels ?? []);
  }, [formation]);

  if (!formation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateFormation(formation, form, onUpdated, () => onOpenChange(false));
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
      </DialogContent>
    </Dialog>
  );
}
