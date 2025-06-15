
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error', 'order'
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- null if for all admins
  is_for_all_admins BOOLEAN NOT NULL DEFAULT false,
  is_read BOOLEAN NOT NULL DEFAULT false,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE, -- reference to order if it's an order notification
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for admins to see all notifications intended for admins
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

-- Create policy for admins to update notifications (mark as read)
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

-- Create policy for system to insert notifications
CREATE POLICY "System can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Add trigger to update updated_at column
CREATE TRIGGER update_notifications_updated_at 
  BEFORE UPDATE ON public.notifications 
  FOR EACH ROW 
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Create function to notify admins when a new order is created
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
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically notify admins when a new order is created
CREATE TRIGGER notify_admins_on_new_order
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admins_new_order();
