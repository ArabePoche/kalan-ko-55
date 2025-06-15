
-- Autoriser les administrateurs à insérer des formations
CREATE POLICY "Admins can insert formations"
  ON public.formations
  FOR INSERT
  WITH CHECK (
    (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) = 'admin'
  );
