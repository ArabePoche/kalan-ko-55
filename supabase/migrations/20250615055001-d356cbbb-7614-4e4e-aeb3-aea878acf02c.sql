
-- Active la Row Level Security sur la table products (au cas où)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Autorise les administrateurs à insérer des produits
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (
    (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) = 'admin'
  );
