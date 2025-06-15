
-- Ajout des colonnes demandées à la table formations

ALTER TABLE public.formations
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS video_promo_id TEXT,
  ADD COLUMN IF NOT EXISTS category UUID REFERENCES public.categories(id),
  ADD COLUMN IF NOT EXISTS duration INTEGER;

COMMENT ON COLUMN public.formations.title IS 'Titre de la formation';
COMMENT ON COLUMN public.formations.description IS 'Description de la formation';
COMMENT ON COLUMN public.formations.price IS 'Prix de la formation';
COMMENT ON COLUMN public.formations.author_id IS 'Auteur (enseignant) de la formation';
COMMENT ON COLUMN public.formations.thumbnail_url IS 'URL de la miniature de la formation';
COMMENT ON COLUMN public.formations.video_promo_id IS 'Identifiant ou URL de la vidéo promotionnelle';
COMMENT ON COLUMN public.formations.category IS 'Catégorie de la formation (nouveau champ, différent de category_id)';
COMMENT ON COLUMN public.formations.duration IS 'Durée totale de la formation (en minutes ou heures)';
