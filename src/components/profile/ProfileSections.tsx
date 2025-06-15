
import { Card, CardContent } from "@/components/ui/card";
import CoursesPage from "../CoursesPage";

export const ProfileSections = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Mes Cours</h2>
        <CoursesPage />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Mes Commandes</h2>
        <Card>
          <CardContent className="p-4">
            <p>Vous n'avez aucune commande récente.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
