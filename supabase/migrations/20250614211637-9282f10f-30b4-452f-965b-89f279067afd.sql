
-- Create comments table for video comments and replies
CREATE TABLE public.video_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.video_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_video_comments_video_id ON public.video_comments(video_id);
CREATE INDEX idx_video_comments_user_id ON public.video_comments(user_id);
CREATE INDEX idx_video_comments_parent_id ON public.video_comments(parent_comment_id);
CREATE INDEX idx_video_comments_created_at ON public.video_comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view comments" 
  ON public.video_comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create comments" 
  ON public.video_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON public.video_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.video_comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create table for comment likes
CREATE TABLE public.video_comment_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.video_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Create indexes for comment likes
CREATE INDEX idx_video_comment_likes_comment_id ON public.video_comment_likes(comment_id);
CREATE INDEX idx_video_comment_likes_user_id ON public.video_comment_likes(user_id);

-- Enable RLS for comment likes
ALTER TABLE public.video_comment_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for comment likes
CREATE POLICY "Anyone can view comment likes" 
  ON public.video_comment_likes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can like comments" 
  ON public.video_comment_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" 
  ON public.video_comment_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_video_comments_updated_at
  BEFORE UPDATE ON public.video_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update comment count on videos table
CREATE OR REPLACE FUNCTION public.update_video_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Only count top-level comments (not replies)
    IF NEW.parent_comment_id IS NULL THEN
      UPDATE public.videos 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.video_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Only count top-level comments (not replies)
    IF OLD.parent_comment_id IS NULL THEN
      UPDATE public.videos 
      SET comments_count = GREATEST(0, comments_count - 1) 
      WHERE id = OLD.video_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update video comments count
CREATE TRIGGER video_comments_count_trigger
  AFTER INSERT OR DELETE ON public.video_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_video_comments_count();

-- Create function to update comment likes count
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.video_comments 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.video_comments 
    SET likes_count = GREATEST(0, likes_count - 1) 
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update comment likes count
CREATE TRIGGER comment_likes_count_trigger
  AFTER INSERT OR DELETE ON public.video_comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_likes_count();
