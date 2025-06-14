
-- Create enum types for better data integrity
CREATE TYPE public.product_type AS ENUM ('formation', 'article', 'service');
CREATE TYPE public.video_type AS ENUM ('promo', 'educational', 'testimonial');
CREATE TYPE public.lesson_status AS ENUM ('locked', 'available', 'completed');
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');

-- Users profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role user_role DEFAULT 'student',
  bio TEXT,
  subscribers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (formations, articles, services)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  instructor_id UUID REFERENCES public.profiles(id),
  product_type product_type NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  badge TEXT,
  discount_percentage INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Formations table (specific details for formations)
CREATE TABLE public.formations (
  id UUID PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  duration_hours INTEGER,
  level_count INTEGER DEFAULT 1,
  total_lessons INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0
);

-- Levels table (for formation structure)
CREATE TABLE public.levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT, -- Format: "15:30"
  video_url TEXT,
  order_index INTEGER NOT NULL,
  has_exercise BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User lesson progress
CREATE TABLE public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  status lesson_status DEFAULT 'locked',
  exercise_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, lesson_id)
);

-- Videos table (for VideoFeed)
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES public.profiles(id),
  video_url TEXT,
  thumbnail_url TEXT,
  video_type video_type DEFAULT 'educational',
  product_id UUID REFERENCES public.products(id), -- For promo videos
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- User enrollments (for purchased formations)
CREATE TABLE public.user_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  formation_id UUID REFERENCES public.formations(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, formation_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);

-- RLS Policies for formations (public read)
CREATE POLICY "Anyone can view formations" ON public.formations FOR SELECT USING (true);

-- RLS Policies for levels and lessons (public read)
CREATE POLICY "Anyone can view levels" ON public.levels FOR SELECT USING (true);
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);

-- RLS Policies for user progress (user-specific)
CREATE POLICY "Users can view their own progress" ON public.user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_lesson_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for videos (public read)
CREATE POLICY "Anyone can view active videos" ON public.videos FOR SELECT USING (is_active = true);

-- RLS Policies for cart (user-specific)
CREATE POLICY "Users can manage their own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for orders (user-specific)
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order items (view through orders)
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
);

-- RLS Policies for enrollments (user-specific)
CREATE POLICY "Users can view their own enrollments" ON public.user_enrollments FOR SELECT USING (auth.uid() = user_id);

-- Insert initial categories
INSERT INTO public.categories (name, label, description) VALUES
('all', 'Tout', 'Toutes les catégories'),
('formation', 'Formations', 'Cours et formations en ligne'),
('article', 'Livres', 'Livres et articles'),
('service', 'Services', 'Services et consultations');

-- Insert sample products without instructor references
INSERT INTO public.products (id, title, description, price, original_price, product_type, category_id, image_url, badge, discount_percentage, rating, students_count) VALUES
(gen_random_uuid(), 'Formation Coran Complet', 'Apprenez les bases de la lecture du Coran avec cette formation complète.', 49.99, 79.99, 'formation', (SELECT id FROM public.categories WHERE name = 'formation'), '/placeholder.svg', 'Bestseller', 38, 4.8, 1234),
(gen_random_uuid(), 'Sciences Islamiques Avancées', 'Formation approfondie en sciences islamiques.', 79.99, NULL, 'formation', (SELECT id FROM public.categories WHERE name = 'formation'), '/placeholder.svg', NULL, NULL, 4.9, 856),
(gen_random_uuid(), 'Livre: Guide du Musulman', 'Guide complet pour le musulman moderne.', 24.99, NULL, 'article', (SELECT id FROM public.categories WHERE name = 'article'), '/placeholder.svg', 'Nouveau', NULL, 4.7, 450),
(gen_random_uuid(), 'Consultation Spirituelle', 'Consultation personnalisée avec un imam.', 35.00, NULL, 'service', (SELECT id FROM public.categories WHERE name = 'service'), '/placeholder.svg', NULL, NULL, 4.9, 89),
(gen_random_uuid(), 'Livre: Histoire de l''Islam', 'Histoire complète de la civilisation islamique.', 19.99, NULL, 'article', (SELECT id FROM public.categories WHERE name = 'article'), '/placeholder.svg', NULL, NULL, 4.6, 320),
(gen_random_uuid(), 'Service: Cours particuliers', 'Cours particuliers de langue arabe.', 45.00, NULL, 'service', (SELECT id FROM public.categories WHERE name = 'service'), '/placeholder.svg', NULL, NULL, 4.8, 156);

-- Insert formation details for formation products
INSERT INTO public.formations (id, duration_hours, level_count, total_lessons)
SELECT id, 20, 2, 5 
FROM public.products 
WHERE product_type = 'formation';

-- Insert sample videos without author references
INSERT INTO public.videos (title, description, video_url, thumbnail_url, video_type, product_id, likes_count, comments_count, views_count) VALUES
('Formation Coran - Niveau Débutant', 'Apprenez les bases de la lecture du Coran avec cette formation complète.', 'https://example.com/video1.mp4', '/placeholder.svg', 'promo', (SELECT id FROM public.products WHERE title = 'Formation Coran Complet' LIMIT 1), 1234, 89, 2340),
('Les bienfaits de la science', 'Découvrez comment la science nous aide à mieux comprendre le monde.', 'https://example.com/video2.mp4', '/placeholder.svg', 'educational', NULL, 856, 45, 1890);

-- Create trigger to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
