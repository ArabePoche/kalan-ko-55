
import { PenTool, CheckCircle, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'practice' | 'assignment';
  status: 'completed' | 'in_progress' | 'not_started';
  duration: string;
  points?: number;
}

interface FormationExercisesSectionProps {
  formationId: string;
}

const FormationExercisesSection = ({ formationId }: FormationExercisesSectionProps) => {
  // Données factices pour la démonstration
  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'Quiz - Alphabet arabe',
      description: 'Testez vos connaissances sur les lettres de l\'alphabet arabe',
      type: 'quiz',
      status: 'completed',
      duration: '10 min',
      points: 85
    },
    {
      id: '2',
      title: 'Exercice de récitation',
      description: 'Pratiquez la récitation de la première sourate',
      type: 'practice',
      status: 'in_progress',
      duration: '20 min'
    },
    {
      id: '3',
      title: 'Devoir - Règles de Tajwid',
      description: 'Complétez cet exercice sur les règles de base du Tajwid',
      type: 'assignment',
      status: 'not_started',
      duration: '30 min'
    }
  ];

  const getStatusIcon = (status: Exercise['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Play className="w-5 h-5 text-[#8696a0]" />;
    }
  };

  const getStatusText = (status: Exercise['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      default:
        return 'Non commencé';
    }
  };

  const getTypeLabel = (type: Exercise['type']) => {
    switch (type) {
      case 'quiz':
        return 'Quiz';
      case 'practice':
        return 'Pratique';
      case 'assignment':
        return 'Devoir';
      default:
        return 'Exercice';
    }
  };

  return (
    <div className="h-full bg-[#0b141a] text-white p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Exercices de la formation</h2>
          <p className="text-[#8696a0]">Pratiquez et évaluez vos connaissances</p>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="bg-[#202c33] border-[#313d44]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="bg-[#313d44] text-[#8696a0]">
                        {getTypeLabel(exercise.type)}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(exercise.status)}
                        <span className="text-sm text-[#8696a0]">{getStatusText(exercise.status)}</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-white mb-1">{exercise.title}</h3>
                    <p className="text-sm text-[#8696a0] mb-2">{exercise.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-[#8696a0]">
                      <span>⏱️ {exercise.duration}</span>
                      {exercise.points && (
                        <span>🏆 {exercise.points}/100 points</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button
                      variant={exercise.status === 'completed' ? 'outline' : 'default'}
                      size="sm"
                      className={
                        exercise.status === 'completed'
                          ? 'border-[#313d44] text-[#8696a0] hover:text-white hover:bg-[#2a3942]'
                          : 'bg-primary hover:bg-primary/90'
                      }
                    >
                      {exercise.status === 'completed' ? 'Revoir' : 'Commencer'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {exercises.length === 0 && (
          <div className="text-center py-12">
            <PenTool className="w-16 h-16 text-[#8696a0] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Aucun exercice disponible</h3>
            <p className="text-[#8696a0]">Les exercices seront ajoutés prochainement</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationExercisesSection;
