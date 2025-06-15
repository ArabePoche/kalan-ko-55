
-- Drop the existing foreign key constraint which incorrectly points to the auth schema
ALTER TABLE public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;

-- Add a new foreign key constraint that correctly references the public profiles table
ALTER TABLE public.user_sessions
ADD CONSTRAINT user_sessions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
