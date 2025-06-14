
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

export const useMyCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my_courses', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase.rpc('get_user_courses', {
        user_id_param: user.id,
      });

      if (error) {
        console.error("Error fetching user courses:", error);
        throw error;
      }
      
      // The RPC function might return null if there are no courses
      if (!data) return [];

      return data.map(course => ({
        id: course.id,
        title: course.title,
        image: course.image_url || '/placeholder.svg',
        totalLessons: course.total_lessons,
        completedLessons: Number(course.completed_lessons),
        progress: course.total_lessons > 0 ? (Number(course.completed_lessons) / course.total_lessons) * 100 : 0,
      }));
    },
    enabled: !!user,
  });
};
