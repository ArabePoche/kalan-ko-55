
-- Ajoute une colonne pour l’URL ou l’ID de la vidéo promotionnelle à products
ALTER TABLE public.products
ADD COLUMN promo_video_url TEXT;

-- (Optionnel) Ajoute une description à la colonne pour la documentation
COMMENT ON COLUMN public.products.promo_video_url IS 'URL ou identifiant de la vidéo promotionnelle associée à la formation';
