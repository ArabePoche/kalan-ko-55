
import React from "react";
import { useState } from "react";
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

  // Update form whenever a new formation is selected
  // (no-op if formation is null)
  React.useEffect(() => {
    setForm(formation ? { ...formation } : {});
  }, [formation]);

  if (!formation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    // Basic validation: title and price required
    if (!form.title || !form.price) {
      toast({
        title: "Champs requis",
        description: "Le titre et le prix sont obligatoires.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Update DB
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
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            placeholder="Titre"
            value={form.title ?? ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            disabled={loading}
          />
          <Textarea
            placeholder="Description"
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            disabled={loading}
          />
          <Input
            placeholder="Prix (€)"
            type="number"
            value={form.price ?? ""}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            disabled={loading}
          />
          <Input
            placeholder="Prix original (€) (optionnel)"
            type="number"
            value={form.original_price ?? ""}
            onChange={(e) =>
              setForm({ ...form, original_price: e.target.value })
            }
            disabled={loading}
          />
          <Input
            placeholder="URL de l’image (optionnel)"
            value={form.image_url ?? ""}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            disabled={loading}
          />
          <Input
            placeholder="Badge (optionnel)"
            value={form.badge ?? ""}
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            disabled={loading}
          />
          <Input
            placeholder="Note (optionnel)"
            type="number"
            step="0.01"
            value={form.rating ?? ""}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            disabled={loading}
          />
          <Input
            placeholder="Nb étudiants (optionnel)"
            type="number"
            value={form.students_count ?? ""}
            onChange={(e) =>
              setForm({ ...form, students_count: e.target.value })
            }
            disabled={loading}
          />
          <Input
            placeholder="ID formateur (optionnel)"
            value={form.instructor_id ?? ""}
            onChange={(e) => setForm({ ...form, instructor_id: e.target.value })}
            disabled={loading}
          />
          <Input
            placeholder="Réduction % (optionnel)"
            type="number"
            value={form.discount_percentage ?? ""}
            onChange={(e) =>
              setForm({ ...form, discount_percentage: e.target.value })
            }
            disabled={loading}
          />
          <Input
            placeholder="Durée (en minutes, optionnel)"
            type="number"
            value={form.duration ?? ""}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            disabled={loading}
          />
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

