
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import FormationCreateForm from '../FormationCreateForm';
import FormationsList from '../FormationsList';

interface AdminFormationsTabProps {
  categories: any[];
  loadingCategories: boolean;
  formations: any[];
  loadingFormations: boolean;
  formationError: Error | null;
  refetchFormations: () => void;
}

export default function AdminFormationsTab({
  categories,
  loadingCategories,
  formations,
  loadingFormations,
  formationError,
  refetchFormations
}: AdminFormationsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des Formations</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Formation
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle formation</CardTitle>
        </CardHeader>
        <CardContent>
          <FormationCreateForm
            categories={categories || []}
            loadingCategories={loadingCategories}
            onCreated={refetchFormations}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Formations Existantes</CardTitle>
        </CardHeader>
        <CardContent>
          <FormationsList
            formations={formations}
            loading={loadingFormations}
            error={formationError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
