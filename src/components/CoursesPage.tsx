
import { BookOpen, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CoursesPage = () => {
  const myCourses = [
    {
      id: '1',
      title: 'Formation Coran Complet',
      progress: 65,
      totalLessons: 20,
      completedLessons: 13,
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="p-4 pt-16 bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">Mes Cours</h1>
        <p className="text-primary-foreground/80 mt-2">Continuez votre apprentissage</p>
      </div>

      {/* My Courses */}
      <div className="p-4 space-y-4">
        {myCourses.length > 0 ? (
          myCourses.map((course) => (
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
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Continuer
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucun cours</h3>
            <p className="text-muted-foreground mb-4">Vous n'avez pas encore de formations</p>
            <Button>Découvrir la boutique</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
