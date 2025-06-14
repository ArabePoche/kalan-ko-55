
-- Create a table for video likes
CREATE TABLE public.video_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Add Row Level Security (RLS) to ensure users can only manage their own likes
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own likes
CREATE POLICY "Users can view their own likes" 
  ON public.video_likes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own likes
CREATE POLICY "Users can create their own likes" 
  ON public.video_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own likes
CREATE POLICY "Users can delete their own likes" 
  ON public.video_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Update the videos table to use actual video data from the database
UPDATE public.videos 
SET likes_count = 0, comments_count = 0, views_count = 0 
WHERE likes_count IS NULL OR comments_count IS NULL OR views_count IS NULL;
