
-- Supprimer les anciennes politiques d'upload et d'update pour les remplacer
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

-- Créer une nouvelle politique pour l'upload qui valide le type et la taille du fichier
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (metadata ->> 'size')::bigint <= 5242880 -- 5MB en bytes
  AND metadata ->> 'mimetype' IN ('image/jpeg', 'image/png', 'image/webp', 'image/jpg')
);

-- Recréer la politique de mise à jour.
-- Elle n'est pas utilisée par le code actuel et ne peut pas valider les nouvelles métadonnées
-- à cause d'une limitation de Supabase. Si la mise à jour de fichiers est implémentée plus tard, 
-- il faudra utiliser une autre approche (ex: trigger).
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
