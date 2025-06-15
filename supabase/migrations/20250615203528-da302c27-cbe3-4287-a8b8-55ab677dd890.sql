
-- Création de la table des professeurs (teachers)
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  formation_id UUID NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Active la Row Level Security sur la table teachers
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- (Optionnel) Politique d’accès : seuls les admins pourront manipuler les professeurs.
-- À adapter selon votre logique d’accès (ici, politique très restrictive à compléter après ajout du système d’authentification/roles).
-- CREATE POLICY "Admins can manage teachers" ON public.teachers
-- FOR ALL
-- TO authenticated
-- USING (public.has_role(auth.uid(), 'admin'));

