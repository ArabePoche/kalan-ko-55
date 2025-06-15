
-- Vérifier et corriger les politiques RLS pour les notifications

-- D'abord, supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can view admin notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can update admin notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

-- Créer les nouvelles politiques avec les bonnes permissions
-- Politique pour que les utilisateurs voient leurs propres notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour que les admins voient toutes les notifications qui leur sont destinées
CREATE POLICY "Admins can view admin notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (
    is_for_all_admins = true 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Politique pour que les utilisateurs puissent marquer leurs notifications comme lues
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour que les admins puissent marquer les notifications admin comme lues
CREATE POLICY "Admins can update admin notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (
    is_for_all_admins = true 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Politique pour permettre l'insertion de notifications par le système
CREATE POLICY "System can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- S'assurer que le trigger existe et fonctionne correctement
DROP TRIGGER IF EXISTS notify_admins_on_new_order ON public.orders;

-- Recréer le trigger pour notifier lors de nouvelles commandes
CREATE TRIGGER notify_admins_on_new_order
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_order();
