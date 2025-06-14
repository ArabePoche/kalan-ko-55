
-- Insert levels for the two formations
WITH formation_data_coran AS (
  SELECT id FROM public.products WHERE title = 'Formation Coran Complet'
),
formation_data_sciences AS (
  SELECT id FROM public.products WHERE title = 'Sciences Islamiques Avancées'
)
INSERT INTO public.levels (formation_id, title, description, order_index)
SELECT id, 'Niveau 1: Les bases', 'Apprentissage de l''alphabet et des règles de base.', 1 FROM formation_data_coran
UNION ALL
SELECT id, 'Niveau 2: Tajwid', 'Perfectionnement de la prononciation et des règles de récitation.', 2 FROM formation_data_coran
UNION ALL
SELECT id, 'Niveau 1: Fiqh', 'Étude de la jurisprudence islamique.', 1 FROM formation_data_sciences
UNION ALL
SELECT id, 'Niveau 2: Aqida', 'Étude des fondements de la croyance.', 2 FROM formation_data_sciences;

-- Insert lessons for "Formation Coran Complet"
WITH level_data_base AS (
  SELECT l.id FROM public.levels l
  JOIN public.products p ON l.formation_id = p.id
  WHERE p.title = 'Formation Coran Complet' AND l.title = 'Niveau 1: Les bases'
),
level_data_tajwid AS (
  SELECT l.id FROM public.levels l
  JOIN public.products p ON l.formation_id = p.id
  WHERE p.title = 'Formation Coran Complet' AND l.title = 'Niveau 2: Tajwid'
)
INSERT INTO public.lessons (level_id, title, duration, order_index, has_exercise)
SELECT id, 'Leçon 1: Alphabet Arabe (Alif, Ba, Ta)', '15:00', 1, true FROM level_data_base
UNION ALL
SELECT id, 'Leçon 2: Les voyelles courtes (Fatha, Damma, Kasra)', '12:30', 2, true FROM level_data_base
UNION ALL
SELECT id, 'Leçon 3: Les règles du Noon Sakinah', '20:00', 1, true FROM level_data_tajwid;

-- Insert lessons for "Sciences Islamiques Avancées"
WITH level_data_fiqh AS (
  SELECT l.id FROM public.levels l
  JOIN public.products p ON l.formation_id = p.id
  WHERE p.title = 'Sciences Islamiques Avancées' AND l.title = 'Niveau 1: Fiqh'
),
level_data_aqida AS (
  SELECT l.id FROM public.levels l
  JOIN public.products p ON l.formation_id = p.id
  WHERE p.title = 'Sciences Islamiques Avancées' AND l.title = 'Niveau 2: Aqida'
)
INSERT INTO public.lessons (level_id, title, duration, order_index, has_exercise)
SELECT id, 'Leçon 1: Introduction au Fiqh', '18:00', 1, true FROM level_data_fiqh
UNION ALL
SELECT id, 'Leçon 2: Les piliers de la foi', '22:00', 1, true FROM level_data_aqida;
