
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface Formation {
  id: string;
  title?: string;
}

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
}

const TeacherSelectUserForm = ({
  onAdded,
}: {
  onAdded?: () => void;
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Charger les utilisateurs (ajusté : email n'existe pas sur profiles !)
    supabase
      .from("profiles")
      .select("id, first_name, last_name, username, avatar_url")
      .then(({ data }) => {
        setProfiles(data || []);
      });
    // Charger les formations
    supabase
      .from("formations")
      .select("id, title")
      .then(({ data }) => setFormations(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const user = profiles.find((p) => p.id === selectedUser);
    if (!user) {
      setError("Veuillez sélectionner un utilisateur.");
      setLoading(false);
      return;
    }
    if (!selectedFormation) {
      setError("Veuillez sélectionner une formation.");
      setLoading(false);
      return;
    }
    // Création du prof (l'email n'est pas stocké dans profiles, on met 'inconnu')
    const { error: insertError } = await supabase.from("teachers").insert([
      {
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.username ?? "inconnu", // Utilise username à la place d'un email si existant
        avatar_url: user.avatar_url ?? "",
        formation_id: selectedFormation,
      },
    ]);
    if (insertError) {
      setError("Erreur lors de l'ajout du prof : " + insertError.message);
    } else {
      if (onAdded) onAdded();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-muted/40 rounded p-3 mb-4">
      <div>
        <label className="block text-sm mb-1">Utilisateur existant</label>
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un utilisateur" />
          </SelectTrigger>
          <SelectContent>
            {profiles.length === 0 ? (
              <div className="px-8 py-2 text-sm text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            ) : (
              profiles.map((u) => (
                <SelectItem value={u.id} key={u.id}>
                  {u.first_name} {u.last_name} ({u.username ?? u.id})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm mb-1 mt-2">Formation à associer</label>
        <Select value={selectedFormation} onValueChange={setSelectedFormation}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une formation" />
          </SelectTrigger>
          <SelectContent>
            {formations.length === 0 ? (
              <div className="px-8 py-2 text-sm text-muted-foreground">
                Aucune formation
              </div>
            ) : (
              formations.map((f) => (
                <SelectItem value={f.id} key={f.id}>
                  {f.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
      <Button type="submit" size="sm" disabled={loading || !selectedUser || !selectedFormation}>
        {loading ? "Ajout..." : "Ajouter le prof"}
      </Button>
    </form>
  );
};

export default TeacherSelectUserForm;
