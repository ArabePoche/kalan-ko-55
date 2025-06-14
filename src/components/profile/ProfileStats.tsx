
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProfileStats = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Formations suivies: 5</p>
        <p>Certificats obtenus: 2</p>
        <p>Heures d'apprentissage: 42</p>
      </CardContent>
    </Card>
  );
};
