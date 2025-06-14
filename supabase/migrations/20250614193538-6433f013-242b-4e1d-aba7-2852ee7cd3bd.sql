
CREATE OR REPLACE FUNCTION get_user_courses(user_id_param uuid)
RETURNS TABLE (
    id uuid,
    title text,
    image_url text,
    total_lessons integer,
    completed_lessons bigint,
    product_type product_type
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.image_url,
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
        p.product_type
    FROM public.user_enrollments ue
    JOIN public.formations f ON ue.formation_id = f.id
    JOIN public.products p ON f.id = p.id
    WHERE ue.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;
