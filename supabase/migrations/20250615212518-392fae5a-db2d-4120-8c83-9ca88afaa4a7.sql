
-- 1. Migrer les produits de type "formation" de la table products vers formations
INSERT INTO public.formations (
    id,
    title,
    description,
    price,
    original_price,
    image_url,
    instructor_id,
    category_id,
    is_active,
    badge,
    rating,
    students_count,
    promo_video_url,
    discount_percentage,
    created_at,
    updated_at
)
SELECT
    p.id,
    p.title,
    p.description,
    p.price,
    p.original_price,
    p.image_url,
    p.instructor_id,
    p.category_id,
    COALESCE(p.is_active, true),
    p.badge,
    p.rating,
    p.students_count,
    p.promo_video_url,
    p.discount_percentage,
    p.created_at,
    p.updated_at
FROM public.products p
WHERE p.product_type = 'formation'
  AND NOT EXISTS (SELECT 1 FROM public.formations f WHERE f.id = p.id);

-- 2. Désactiver les anciennes entrées "formation" dans products
UPDATE public.products
SET is_active = false
WHERE product_type = 'formation';

-- (Optionnel) Tu peux supprimer complètement ces lignes de products si tu le souhaites :
-- DELETE FROM public.products WHERE product_type = 'formation';
