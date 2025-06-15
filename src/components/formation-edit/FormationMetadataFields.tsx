
import React from "react";
import { Input } from "@/components/ui/input";

interface FormationMetadataFieldsProps {
  form: any;
  setForm: (form: any) => void;
  loading: boolean;
}

export default function FormationMetadataFields({ form, setForm, loading }: FormationMetadataFieldsProps) {
  return (
    <div className="space-y-3">
      {/* IMAGE */}
      <label className="block text-sm font-medium mb-1">URL de l'image (optionnel)</label>
      <Input
        placeholder="URL de l'image (optionnel)"
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
      <label className="block text-sm font-medium mb-1">Nombre d'étudiants (optionnel)</label>
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

      {/* DURÉE */}
      <label className="block text-sm font-medium mb-1">Durée (en minutes, optionnel)</label>
      <Input
        placeholder="Durée (en minutes, optionnel)"
        type="number"
        value={form.duration ?? ""}
        onChange={(e) => setForm({ ...form, duration: e.target.value })}
        disabled={loading}
      />
    </div>
  );
}
