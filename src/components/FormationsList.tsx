
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormationEditModal from "./FormationEditModal";

interface FormationsListProps {
  formations: any[];
  loading?: boolean;
  error?: Error | null;
  // Optionnel : refresher appelé après update
  onUpdated?: () => void;
}

const FormationsList = ({ formations, loading, error, onUpdated }: FormationsListProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [formationToEdit, setFormationToEdit] = useState<any>(null);

  if (loading) {
    return <p>Chargement…</p>;
  }
  if (error) {
    return <p className="text-destructive">Erreur: {error.message}</p>;
  }
  if (!formations || formations.length === 0) {
    return <p>Aucune formation n’a été trouvée.</p>;
  }
  return (
    <div className="space-y-4">
      {formations.map((formation) => (
        <div key={formation.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium">{formation.title ?? "Sans titre"}</h3>
              <p className="text-sm text-muted-foreground">
                {formation.students_count ?? 0} étudiants
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFormationToEdit(formation);
                setEditOpen(true);
              }}
            >
              Modifier
            </Button>
          </div>
        </div>
      ))}
      <FormationEditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        formation={formationToEdit}
        onUpdated={() => {
          setEditOpen(false);
          setFormationToEdit(null);
          onUpdated && onUpdated();
        }}
      />
    </div>
  );
};

export default FormationsList;
