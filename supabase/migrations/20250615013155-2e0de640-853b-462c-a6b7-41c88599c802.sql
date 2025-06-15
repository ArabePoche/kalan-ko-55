
-- Vérifier que la fonction notify_admins_new_order existe et fonctionne correctement
-- D'abord, recréer la fonction avec les bonnes permissions

CREATE OR REPLACE FUNCTION public.notify_admins_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert notification for all admins
  INSERT INTO public.notifications (
    title,
    message,
    type,
    is_for_all_admins,
    order_id
  ) VALUES (
    'Nouvelle commande à valider',
    'Une nouvelle commande d''un montant de ' || NEW.total_amount || '€ nécessite votre validation.',
    'order',
    true,
    NEW.id
  );
  
  -- Insert notification for the buyer
  INSERT INTO public.notifications (
    title,
    message,
    type,
    user_id,
    order_id
  ) VALUES (
    'Commande passée avec succès',
    'Votre commande d''un montant de ' || NEW.total_amount || '€ a été soumise et sera examinée par un administrateur.',
    'order',
    NEW.user_id,
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

-- S'assurer que le trigger est bien attaché
DROP TRIGGER IF EXISTS notify_admins_on_new_order ON public.orders;

CREATE TRIGGER notify_admins_on_new_order
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_order();

-- Vérifier les politiques RLS pour les notifications
-- Assurer que les notifications peuvent être lues par les bonnes personnes

-- Politique pour permettre aux utilisateurs de voir leurs propres notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour permettre aux admins de voir les notifications qui leur sont destinées
DROP POLICY IF EXISTS "Admins can view admin notifications" ON public.notifications;
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

-- Politique pour permettre l'insertion par le système (triggers)
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "System can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs notifications
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour permettre aux admins de mettre à jour les notifications admin
DROP POLICY IF EXISTS "Admins can update admin notifications" ON public.notifications;
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
