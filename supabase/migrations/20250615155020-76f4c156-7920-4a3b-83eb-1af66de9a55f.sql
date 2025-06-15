
-- Insérer une nouvelle formation sur l'apprentissage à la lecture en arabe
INSERT INTO public.products (
  id,
  title,
  description,
  product_type,
  price,
  original_price,
  discount_percentage,
  image_url,
  promo_video_url,
  badge,
  rating,
  students_count,
  is_active,
  instructor_id
) VALUES (
  gen_random_uuid(),
  'Apprentissage de la lecture en arabe',
  'Formation complète pour apprendre à lire l''arabe facilement. Méthode progressive adaptée aux débutants avec exercices pratiques et prononciation.',
  'formation',
  49.99,
  79.99,
  38,
  '/placeholder.svg',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'Nouveau',
  4.8,
  156,
  true,
  (SELECT id FROM public.profiles WHERE role = 'instructor' LIMIT 1)
);

-- Insérer la formation correspondante
INSERT INTO public.formations (
  id,
  title,
  description,
  price,
  original_price,
  discount_percentage,
  image_url,
  promo_video_url,
  badge,
  rating,
  students_count,
  is_active,
  instructor_id,
  level_count,
  total_lessons,
  duration_hours
) VALUES (
  (SELECT id FROM public.products WHERE title = 'Apprentissage de la lecture en arabe'),
  'Apprentissage de la lecture en arabe',
  'Formation complète pour apprendre à lire l''arabe facilement. Méthode progressive adaptée aux débutants avec exercices pratiques et prononciation.',
  49.99,
  79.99,
  38,
  '/placeholder.svg',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'Nouveau',
  4.8,
  156,
  true,
  (SELECT id FROM public.profiles WHERE role = 'instructor' LIMIT 1),
  3,
  12,
  8
);
