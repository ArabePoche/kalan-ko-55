
-- Create table for feedback submissions
CREATE TABLE public.feedback_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'post')),
  content_title TEXT NOT NULL,
  submitted_by TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for expert reviews
CREATE TABLE public.expert_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.feedback_submissions(id) ON DELETE CASCADE,
  expert_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'suggest', 'correct', 'reject')),
  comment TEXT NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for feedback statistics (for caching/tracking purposes)
CREATE TABLE public.feedback_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_submissions INTEGER NOT NULL DEFAULT 0,
  pending_review INTEGER NOT NULL DEFAULT 0,
  approved_today INTEGER NOT NULL DEFAULT 0,
  rejected_today INTEGER NOT NULL DEFAULT 0,
  average_review_time_hours NUMERIC DEFAULT 0,
  approval_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Create table for expert activity tracking
CREATE TABLE public.expert_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_name TEXT NOT NULL,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  last_review_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(expert_name)
);

-- Enable Row Level Security
ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback_submissions (allow read for all authenticated users, insert/update for admins)
CREATE POLICY "Anyone can view feedback submissions" ON public.feedback_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert feedback submissions" ON public.feedback_submissions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update feedback submissions" ON public.feedback_submissions FOR UPDATE TO authenticated USING (true);

-- Create policies for expert_reviews
CREATE POLICY "Anyone can view expert reviews" ON public.expert_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Experts can insert reviews" ON public.expert_reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Experts can update reviews" ON public.expert_reviews FOR UPDATE TO authenticated USING (true);

-- Create policies for feedback_stats
CREATE POLICY "Anyone can view feedback stats" ON public.feedback_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can manage feedback stats" ON public.feedback_stats FOR ALL TO authenticated USING (true);

-- Create policies for expert_activity
CREATE POLICY "Anyone can view expert activity" ON public.expert_activity FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can manage expert activity" ON public.expert_activity FOR ALL TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_feedback_submissions_status ON public.feedback_submissions(status);
CREATE INDEX idx_feedback_submissions_submitted_at ON public.feedback_submissions(submitted_at);
CREATE INDEX idx_expert_reviews_submission_id ON public.expert_reviews(submission_id);
CREATE INDEX idx_expert_reviews_reviewed_at ON public.expert_reviews(reviewed_at);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_feedback_submissions_updated_at 
  BEFORE UPDATE ON public.feedback_submissions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expert_activity_updated_at 
  BEFORE UPDATE ON public.expert_activity 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_stats_updated_at 
  BEFORE UPDATE ON public.feedback_stats 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.feedback_submissions (content_id, content_type, content_title, submitted_by, status) VALUES
('v1', 'video', 'Formation Coran - Niveau Débutant', 'Prof. Ahmed', 'pending'),
('p1', 'post', 'Nouveau programme de formation', 'Institut Al-Azhar', 'approved'),
('v2', 'video', 'Tajwid Avancé', 'Dr. Fatima', 'needs_revision'),
('p2', 'post', 'Méthodes d''apprentissage modernes', 'Prof. Hassan', 'pending');

INSERT INTO public.expert_reviews (submission_id, expert_name, action, comment) VALUES
((SELECT id FROM public.feedback_submissions WHERE content_id = 'p1'), 'Dr. Hassan', 'approve', 'Contenu excellent, conforme aux standards.');

INSERT INTO public.expert_activity (expert_name, reviews_count, last_review_at) VALUES
('Dr. Hassan', 34, now() - interval '2 hours'),
('Dr. Fatima', 28, now() - interval '1 day'),
('Prof. Ahmed', 19, now() - interval '3 days');

INSERT INTO public.feedback_stats (total_submissions, pending_review, approved_today, rejected_today, average_review_time_hours, approval_rate) VALUES
(157, 12, 8, 2, 2.5, 78.5);
