import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [loading, setLoading] = useState(false);
  // Nouveaux états pour niveaux et leçons
  const [levels, setLevels] = useState<LevelForm[]>([]);

  // Hydrater à chaque sélection
  React.useEffect(() => {
    setForm(formation ? { ...formation } : {});
    // On attend que les niveaux/lessons véritables viennent du backend plus tard (par ex via meta data)
    setLevels(formation?.levels ?? []);
  }, [formation]);

  if (!formation) return null;

  const handleLevelChange = (idx: number, key: keyof LevelForm, value: any) => {
    const updated = [...levels];
    (updated[idx] as any)[key] = value;
    setLevels(updated);
  };

  const handleLessonChange = (levelIdx: number, lessonIdx: number, key: keyof LessonForm, value: any) => {
    const updated = [...levels];
    updated[levelIdx].lessons[lessonIdx][key] = value;
    setLevels(updated);
  };

  const addLevel = () => {
    setLevels([...levels, { title: "", lessons: [] }]);
  };

  const removeLevel = (i: number) => {
    setLevels(levels.filter((_, idx) => idx !== i));
  };

  const addLesson = (levelIdx: number) => {
    const updated = [...levels];
    updated[levelIdx].lessons.push({ title: "", video_url: "" });
    setLevels(updated);
  };

  const removeLesson = (levelIdx: number, lessonIdx: number) => {
    const updated = [...levels];
    updated[levelIdx].lessons = updated[levelIdx].lessons.filter((_, i) => i !== lessonIdx);
    setLevels(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    // Correction ici : on ne sauvegarde plus “levels”, pour éviter l’erreur.
    const { error } = await supabase
      .from("formations")
      .update({
        title: form.title,
        description: form.description,
        price: form.price ? parseFloat(form.price) : null,
        original_price: form.original_price
          ? parseFloat(form.original_price)
          : null,
        image_url: form.image_url || null,
        badge: form.badge || null,
        rating: form.rating ? parseFloat(form.rating) : 0,
        students_count: form.students_count ? parseInt(form.students_count) : 0,
        instructor_id: form.instructor_id || null,
        discount_percentage: form.discount_percentage
          ? parseInt(form.discount_percentage)
          : null,
        duration: form.duration ? parseInt(form.duration) : null,
      })
      .eq("id", formation.id);

    if (error) {
      toast({
        title: "Erreur lors de la modification",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    toast({
      title: "Formation modifiée",
      description: "Les changements ont été enregistrés.",
    });
    setLoading(false);
    onOpenChange(false);
    onUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la formation</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit} style={{ height: "70vh", maxHeight: "70vh" }}>
          {/* ScrollArea pour un défilement agréable */}
          <ScrollArea className="h-[60vh]">
            <div className="space-y-3">
              {/* TITRE */}
              <label className="block text-sm font-medium mb-1">Titre</label>
              <Input
                placeholder="Titre"
                value={form.title ?? ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                disabled={loading}
              />

              {/* DESCRIPTION */}
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                placeholder="Description"
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={loading}
              />

              {/* PRIX */}
              <label className="block text-sm font-medium mb-1">Prix (€)</label>
              <Input
                placeholder="Prix (€)"
                type="number"
                value={form.price ?? ""}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                disabled={loading}
              />

              {/* PRIX ORIGINAL */}
              <label className="block text-sm font-medium mb-1">Prix original (€) (optionnel)</label>
              <Input
                placeholder="Prix original (€) (optionnel)"
                type="number"
                value={form.original_price ?? ""}
                onChange={(e) =>
                  setForm({ ...form, original_price: e.target.value })
                }
                disabled={loading}
              />

              {/* IMAGE */}
              <label className="block text-sm font-medium mb-1">URL de l’image (optionnel)</label>
              <Input
                placeholder="URL de l’image (optionnel)"
                value={form.image_url ?? ""}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                disabled={loading}
              />

              {/* BADGE */}
              <label className="block text-sm font-medium mb-1">Badge (optionnel)</label>
              <Input
                placeholder="Badge (optionnel)"
                value={form.badge ?? ""}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                disabled={loading}
              />

              {/* NOTE */}
              <label className="block text-sm font-medium mb-1">Note (optionnel)</label>
              <Input
                placeholder="Note (optionnel)"
                type="number"
                step="0.01"
                value={form.rating ?? ""}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                disabled={loading}
              />

              {/* NB ÉTUDIANTS */}
              <label className="block text-sm font-medium mb-1">Nombre d’étudiants (optionnel)</label>
              <Input
                placeholder="Nb étudiants (optionnel)"
                type="number"
                value={form.students_count ?? ""}
                onChange={(e) =>
                  setForm({ ...form, students_count: e.target.value })
                }
                disabled={loading}
              />

              {/* FORMATEUR */}
              <label className="block text-sm font-medium mb-1">ID formateur (optionnel)</label>
              <Input
                placeholder="ID formateur (optionnel)"
                value={form.instructor_id ?? ""}
                onChange={(e) => setForm({ ...form, instructor_id: e.target.value })}
                disabled={loading}
              />

              {/* RÉDUCTION */}
              <label className="block text-sm font-medium mb-1">Réduction % (optionnel)</label>
              <Input
                placeholder="Réduction % (optionnel)"
                type="number"
                value={form.discount_percentage ?? ""}
                onChange={(e) =>
                  setForm({ ...form, discount_percentage: e.target.value })
                }
                disabled={loading}
              />

              {/* DURÉE */}
              <label className="block text-sm font-medium mb-1">Durée (en minutes, optionnel)</label>
              <Input
                placeholder="Durée (en minutes, optionnel)"
                type="number"
                value={form.duration ?? ""}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                disabled={loading}
              />

              {/* GESTION DES NIVEAUX */}
              <div className="border-t pt-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Niveaux</span>
                  <Button size="sm" type="button" variant="outline" onClick={addLevel} disabled={loading}>
                    + Ajouter un niveau
                  </Button>
                </div>
                <div className="space-y-4 mt-2">
                  {levels.map((level, li) => (
                    <div key={li} className="border rounded-md p-2 space-y-2 bg-muted/50">
                      {/* Titre du niveau */}
                      <label className="block text-xs font-medium mb-1">Titre du niveau</label>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Titre du niveau"
                          value={level.title}
                          onChange={e => handleLevelChange(li, "title", e.target.value)}
                          className="flex-1"
                          disabled={loading}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeLevel(li)} disabled={loading}>
                          &times;
                        </Button>
                      </div>
                      {/* gestion des leçons */}
                      <div className="ml-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Leçons</span>
                          <Button type="button" size="sm" variant="secondary" onClick={() => addLesson(li)} disabled={loading}>
                            + Ajouter une leçon
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {level.lessons.map((lesson, lesIdx) => (
                            <div key={lesIdx} className="flex items-center gap-2">
                              <div className="flex-1">
                                <label className="block text-xs font-medium mb-1">Titre de la leçon</label>
                                <Input
                                  placeholder="Titre de la leçon"
                                  value={lesson.title}
                                  onChange={e => handleLessonChange(li, lesIdx, "title", e.target.value)}
                                  disabled={loading}
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs font-medium mb-1">URL vidéo</label>
                                <Input
                                  placeholder="URL vidéo"
                                  value={lesson.video_url}
                                  onChange={e => handleLessonChange(li, lesIdx, "video_url", e.target.value)}
                                  disabled={loading}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeLesson(li, lesIdx)}
                                disabled={loading}
                              >
                                &times;
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
