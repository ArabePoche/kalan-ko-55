
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
}

interface TeachersListProps {
  formationId: string;
}

const TeachersList = ({ formationId }: TeachersListProps) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!formationId) return;
    fetchTeachers();
    // eslint-disable-next-line
  }, [formationId]);

  const fetchTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("formation_id", formationId);
    if (data) setTeachers(data);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("teachers").insert([
      { ...form, formation_id: formationId }
    ]);
    if (!error) {
      setForm({ first_name: "", last_name: "", email: "", avatar_url: "" });
      setShowForm(false);
      fetchTeachers();
    }
    setLoading(false);
  };

  return (
    <div className="my-6 p-4 bg-[#202c33] rounded-xl shadow">
      <div className="flex items-center mb-4 justify-between">
        <h3 className="font-semibold text-white text-lg">Professeurs</h3>
        <Button size="sm" variant="secondary" onClick={() => setShowForm((s) => !s)}>
          <Plus className="w-4 h-4 mr-1" /> Ajouter un prof
        </Button>
      </div>
      {showForm && (
        <form onSubmit={handleAddTeacher} className="mb-4 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              required
              name="first_name"
              placeholder="Prénom"
              value={form.first_name}
              onChange={handleChange}
              className="rounded p-2 text-sm"
            />
            <input
              type="text"
              required
              name="last_name"
              placeholder="Nom"
              value={form.last_name}
              onChange={handleChange}
              className="rounded p-2 text-sm"
            />
            <input
              type="email"
              required
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="rounded p-2 text-sm"
            />
            <input
              type="text"
              name="avatar_url"
              placeholder="Avatar URL (optionnel)"
              value={form.avatar_url}
              onChange={handleChange}
              className="rounded p-2 text-sm"
            />
          </div>
          <Button size="sm" type="submit" disabled={loading}>
            {loading ? "Ajout..." : "Ajouter"}
          </Button>
        </form>
      )}
      {loading && <div className="text-[#25d366]">Chargement…</div>}
      {teachers.length === 0 && !loading && <div className="text-[#8696a0]">Aucun professeur pour cette formation.</div>}
      <div className="flex flex-wrap gap-4 mt-2">
        {teachers.map((t) => (
          <div key={t.id} className="flex items-center gap-2 bg-[#2a3942] rounded shadow p-3">
            <img src={t.avatar_url || "/placeholder.svg"} alt={t.first_name} className="w-10 h-10 rounded-full object-cover border-2 border-[#25d366]" />
            <div>
              <div className="text-white text-sm font-medium">{t.first_name} {t.last_name}</div>
              <div className="text-xs text-[#8696a0]">{t.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersList;
