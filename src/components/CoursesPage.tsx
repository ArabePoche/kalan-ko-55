
import { BookOpen, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useMyCourses } from '@/hooks/useMyCourses';
import { Skeleton } from '@/components/ui/skeleton';

const CoursesPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: myCourses, isLoading: coursesLoading } = useMyCourses();

  const handleContinueCourse = (courseId: string) => {
    navigate(`/formation/${courseId}`);
  };

  const renderContent = () => {
    if (authLoading || (coursesLoading && user)) {
      return (
        <div className="p-4 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
              <Skeleton className="w-full h-32" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="w-full h-2 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center py-12 px-4">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Connectez-vous pour voir vos cours</h3>
          <p className="text-muted-foreground mb-4">Accédez à toutes vos formations après vous être connecté.</p>
          <Button asChild>
            <Link to="/auth">Se connecter / S'inscrire</Link>
          </Button>
        </div>
      );
    }

    if (myCourses && myCourses.length > 0) {
      return (
        <div className="p-4 space-y-4">
          {myCourses.map((course) => (
            <div key={course.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Progression</span>
                    <span>{course.completedLessons}/{course.totalLessons} leçons</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => handleContinueCourse(course.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continuer
                </Button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Aucun cours</h3>
        <p className="text-muted-foreground mb-4">Vous n'avez pas encore de formations</p>
        <Button onClick={() => navigate('/shop')}>Découvrir la boutique</Button>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="p-4 pt-16 bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">Mes Cours</h1>
        <p className="text-primary-foreground/80 mt-2">Continuez votre apprentissage</p>
      </div>

      {/* My Courses */}
      {renderContent()}
    </div>
  );
};

export default CoursesPage;
