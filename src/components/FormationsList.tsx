
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FormationEditModal from "./FormationEditModal";
import FormationDeleteModal from "./FormationDeleteModal";

interface FormationsListProps {
  formations: any[];
  loading?: boolean;
  error?: Error | null;
  // Optionnel : refresher appelé après update
  onUpdated?: () => void;
}

const FormationsList = ({ formations, loading, error, onUpdated }: FormationsListProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formationToEdit, setFormationToEdit] = useState<any>(null);
  const [formationToDelete, setFormationToDelete] = useState<any>(null);

  if (loading) {
    return <p>Chargement…</p>;
  }
  if (error) {
    return <p className="text-destructive">Erreur: {error.message}</p>;
  }
  if (!formations || formations.length === 0) {
    return <p>Aucune formation n'a été trouvée.</p>;
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
              {formation.instructor_id && (
                <p className="text-xs text-muted-foreground">
                  Instructeur: {formation.instructor_id}
                </p>
              )}
              {formation.price && (
                <p className="text-sm font-semibold text-primary">
                  {formation.price}€
                </p>
              )}
            </div>
            <div className="flex gap-2">
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
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  setFormationToDelete(formation);
                  setDeleteOpen(true);
                }}
              >
                Supprimer
              </Button>
            </div>
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
      <FormationDeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        formation={formationToDelete}
        onDeleted={() => {
          setDeleteOpen(false);
          setFormationToDelete(null);
          onUpdated && onUpdated();
        }}
      />
    </div>
  );
};

export default FormationsList;
