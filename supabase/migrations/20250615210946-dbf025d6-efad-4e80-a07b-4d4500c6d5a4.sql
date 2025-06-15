
-- Fonction de sécurité pour vérifier si l’utilisateur est admin
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id AND role = role
  );
$$;

-- Politique: seuls les admins peuvent voir les profs
CREATE POLICY "Admins can select teachers"
  ON public.teachers
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Politique: seuls les admins peuvent créer les profs
CREATE POLICY "Admins can insert teachers"
  ON public.teachers
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
