
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, UserPlus } from "lucide-react";
import TeacherSelectUserForm from "./TeacherSelectUserForm";

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  formation_id: string;
  created_at?: string;
}

const TeachersAdminPanel = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teachers")
      .select("*");
    setTeachers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAdded = () => {
    setOpenForm(false);
    fetchTeachers();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Gestion des profs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={() => setOpenForm((s) => !s)}>
            <UserPlus className="mr-1 w-4 h-4" />
            Ajouter un prof existant
          </Button>
        </div>
        {openForm && (
          <TeacherSelectUserForm onAdded={handleAdded} />
        )}
        <div className="mt-4">
          {loading && <div className="text-muted-foreground">Chargement...</div>}
          {!loading && teachers.length === 0 && <div className="text-muted-foreground">Aucun prof enregistré.</div>}
          {!loading && teachers.length > 0 && (
            <table className="min-w-full bg-background rounded">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="px-2 py-1 text-left">Prénom</th>
                  <th className="px-2 py-1 text-left">Nom</th>
                  <th className="px-2 py-1 text-left">Email</th>
                  <th className="px-2 py-1 text-left">Formation</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/40">
                    <td className="px-2 py-1">{t.first_name}</td>
                    <td className="px-2 py-1">{t.last_name}</td>
                    <td className="px-2 py-1">{t.email}</td>
                    <td className="px-2 py-1">{t.formation_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeachersAdminPanel;
