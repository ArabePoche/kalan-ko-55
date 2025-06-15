
import React from "react";
import { Input } from "@/components/ui/input";

interface FormationPricingFieldsProps {
  form: any;
  setForm: (form: any) => void;
  loading: boolean;
}

export default function FormationPricingFields({ form, setForm, loading }: FormationPricingFieldsProps) {
  return (
    <div className="space-y-3">
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
    </div>
  );
}
