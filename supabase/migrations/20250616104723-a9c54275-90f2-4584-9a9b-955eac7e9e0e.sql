
-- Créer les politiques RLS manquantes pour les tables levels et lessons

-- Politiques pour la table levels
DROP POLICY IF EXISTS "Admins can insert levels" ON public.levels;
CREATE POLICY "Admins can insert levels" 
  ON public.levels 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Instructors can insert levels for their formations" ON public.levels;
CREATE POLICY "Instructors can insert levels for their formations" 
  ON public.levels 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.formations f
      JOIN public.profiles p ON f.instructor_id = p.id
      WHERE f.id = formation_id 
      AND p.id = auth.uid()
      AND p.role = 'instructor'
    )
  );

DROP POLICY IF EXISTS "Admins can view all levels" ON public.levels;
CREATE POLICY "Admins can view all levels" 
  ON public.levels 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Instructors can view levels for their formations" ON public.levels;
CREATE POLICY "Instructors can view levels for their formations" 
  ON public.levels 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.formations f
      JOIN public.profiles p ON f.instructor_id = p.id
      WHERE f.id = formation_id 
      AND p.id = auth.uid()
      AND p.role = 'instructor'
    )
  );

DROP POLICY IF EXISTS "Admins can update levels" ON public.levels;
CREATE POLICY "Admins can update levels" 
  ON public.levels 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete levels" ON public.levels;
CREATE POLICY "Admins can delete levels" 
  ON public.levels 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Politiques pour la table lessons
DROP POLICY IF EXISTS "Admins can insert lessons" ON public.lessons;
CREATE POLICY "Admins can insert lessons" 
  ON public.lessons 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Instructors can insert lessons for their formations" ON public.lessons;
CREATE POLICY "Instructors can insert lessons for their formations" 
  ON public.lessons 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.levels lv
      JOIN public.formations f ON lv.formation_id = f.id
      JOIN public.profiles p ON f.instructor_id = p.id
      WHERE lv.id = level_id 
      AND p.id = auth.uid()
      AND p.role = 'instructor'
    )
  );

DROP POLICY IF EXISTS "Admins can view all lessons" ON public.lessons;
CREATE POLICY "Admins can view all lessons" 
  ON public.lessons 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Instructors can view lessons for their formations" ON public.lessons;
CREATE POLICY "Instructors can view lessons for their formations" 
  ON public.lessons 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.levels lv
      JOIN public.formations f ON lv.formation_id = f.id
      JOIN public.profiles p ON f.instructor_id = p.id
      WHERE lv.id = level_id 
      AND p.id = auth.uid()
      AND p.role = 'instructor'
    )
  );

DROP POLICY IF EXISTS "Admins can update lessons" ON public.lessons;
CREATE POLICY "Admins can update lessons" 
  ON public.lessons 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete lessons" ON public.lessons;
CREATE POLICY "Admins can delete lessons" 
  ON public.lessons 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
