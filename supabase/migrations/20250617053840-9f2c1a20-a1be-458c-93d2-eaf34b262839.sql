
-- Supprimer d'abord la fonction existante
DROP FUNCTION IF EXISTS get_user_courses(uuid);

-- Recréer la fonction avec le bon type de retour
CREATE OR REPLACE FUNCTION get_user_courses(user_id_param uuid)
RETURNS TABLE (
    id uuid,
    title text,
    image_url text,
    total_lessons integer,
    completed_lessons bigint,
    product_type text
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        f.id,
        f.title,
        f.image_url,
        f.total_lessons,
        (
            SELECT COUNT(*)
            FROM public.user_lesson_progress ulp
            JOIN public.lessons l ON ulp.lesson_id = l.id
            JOIN public.levels lv ON l.level_id = lv.id
            WHERE ulp.user_id = user_id_param
            AND lv.formation_id = f.id
            AND ulp.status = 'completed'
        ) as completed_lessons,
        'formation'::text as product_type
    FROM public.user_enrollments ue
    JOIN public.formations f ON ue.formation_id = f.id
    WHERE ue.user_id = user_id_param
    AND f.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Nettoyer les données : s'assurer que toutes les formations actives dans user_enrollments 
-- existent dans la table formations
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
    p.is_active,
    p.badge,
    p.rating,
    p.students_count,
    p.promo_video_url,
    p.discount_percentage,
    p.created_at,
    p.updated_at
FROM public.products p
WHERE p.product_type = 'formation'
  AND p.id IN (
    SELECT DISTINCT ue.formation_id 
    FROM public.user_enrollments ue 
    WHERE ue.formation_id NOT IN (SELECT id FROM public.formations)
  )
ON CONFLICT (id) DO NOTHING;
