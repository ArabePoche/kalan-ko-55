
-- Insère une nouvelle ligne dans public.profiles pour chaque nouvel utilisateur
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, username)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

-- Déclenche la fonction à chaque création d'utilisateur
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Active la sécurité au niveau des lignes (RLS) pour la table des profils
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Ajoute les politiques RLS pour la table des profils
CREATE POLICY "Les profils sont visibles par tout le monde."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Les utilisateurs peuvent insérer leur propre profil."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );
