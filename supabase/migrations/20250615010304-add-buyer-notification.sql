
-- Modifier la fonction pour notifier aussi l'acheteur
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
