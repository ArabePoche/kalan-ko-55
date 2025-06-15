
-- Ajoute les colonnes formation spécifiques dans la table "formations"
ALTER TABLE public.formations
  ADD COLUMN IF NOT EXISTS promo_video_url TEXT,
  ADD COLUMN IF NOT EXISTS badge TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS students_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id),
  ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS discount_percentage INTEGER,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- (Optionnel) Ajoute des commentaires pour documenter les nouvelles colonnes
COMMENT ON COLUMN public.formations.promo_video_url IS 'URL ou ID de la vidéo promotionnelle associée à la formation';
COMMENT ON COLUMN public.formations.badge IS 'Badge spécial (ex. Bestseller, Nouveau)';
COMMENT ON COLUMN public.formations.image_url IS 'Image de couverture de la formation';
COMMENT ON COLUMN public.formations.rating IS 'Note moyenne de la formation';
COMMENT ON COLUMN public.formations.students_count IS 'Nombre de participants';
COMMENT ON COLUMN public.formations.instructor_id IS 'Référence à l''enseignant';
COMMENT ON COLUMN public.formations.category_id IS 'Référence à la catégorie';
COMMENT ON COLUMN public.formations.price IS 'Prix courant de la formation';
COMMENT ON COLUMN public.formations.original_price IS 'Prix original (avant réduction)';
COMMENT ON COLUMN public.formations.description IS 'Description de la formation';
COMMENT ON COLUMN public.formations.is_active IS 'Formation active ou non';
COMMENT ON COLUMN public.formations.discount_percentage IS 'Pourcentage de réduction éventuel';
COMMENT ON COLUMN public.formations.created_at IS 'Date de création de la formation';
COMMENT ON COLUMN public.formations.updated_at IS 'Date de mise à jour de la formation';
