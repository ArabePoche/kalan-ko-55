
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormationBasicFieldsProps {
  form: any;
  setForm: (form: any) => void;
  loading: boolean;
}

export default function FormationBasicFields({ form, setForm, loading }: FormationBasicFieldsProps) {
  return (
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
    </div>
  );
}
