
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Upload, Mic, Play, Pause } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  videoUrl?: string;
  unreadMessages: number;
  hasExercise: boolean;
  exerciseCompleted: boolean;
}

interface LessonExerciseProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonExercise = ({ lesson, onComplete }: LessonExerciseProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const exercises = [
    {
      type: 'text',
      question: 'Récitez la Fatiha en arabe (écrivez la translittération)',
      instruction: 'Écrivez la translittération de la sourate Al-Fatiha',
      placeholder: 'Bismillah ir-Rahman ir-Raheem...'
    },
    {
      type: 'audio',
      question: 'Enregistrez votre récitation de la Fatiha',
      instruction: 'Appuyez sur le bouton pour enregistrer votre voix',
      placeholder: ''
    },
    {
      type: 'text',
      question: 'Expliquez la signification du verset "Iyyaka na\'budu wa iyyaka nasta\'een"',
      instruction: 'Donnez une explication de ce verset en français',
      placeholder: 'Ce verset signifie...'
    }
  ];

  const currentExercise = exercises[currentStep];
  const progress = ((currentStep + 1) / exercises.length) * 100;

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Simulate submission to teacher for validation
    console.log('Exercise submitted for validation:', {
      lessonId: lesson.id,
      answers: answers,
      audio: recordedAudio
    });
  };

  const handleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      console.log('Started recording...');
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setRecordedAudio('recorded-audio-blob');
        console.log('Recording stopped');
      }, 3000);
    } else {
      setIsRecording(false);
      setRecordedAudio('recorded-audio-blob');
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-[#25d366] mx-auto" />
              <h3 className="text-xl font-semibold">Exercice soumis !</h3>
              <p className="text-muted-foreground">
                Votre exercice a été envoyé au professeur pour validation. 
                Vous recevrez une notification une fois qu'il aura été corrigé.
              </p>
              <div className="bg-[#25d366]/10 p-4 rounded-lg">
                <p className="text-sm">
                  💡 En attendant, vous pouvez réviser la leçon ou consulter les autres cours disponibles.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Exercice - {lesson.title}</h2>
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} / {exercises.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Exercise Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentExercise.question}</CardTitle>
          <p className="text-muted-foreground">{currentExercise.instruction}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentExercise.type === 'text' && (
            <Textarea
              value={answers[currentStep]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder={currentExercise.placeholder}
              className="min-h-32"
            />
          )}

          {currentExercise.type === 'audio' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <Button
                  onClick={handleRecord}
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  className="w-20 h-20 rounded-full"
                >
                  <Mic className="w-8 h-8" />
                </Button>
                
                {isRecording && (
                  <div className="text-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mx-auto mb-2"></div>
                    <p className="text-sm text-red-500">Enregistrement en cours...</p>
                  </div>
                )}
                
                {recordedAudio && !isRecording && (
                  <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                    <span className="text-sm">Enregistrement (0:03)</span>
                    <Button variant="ghost" size="sm" onClick={() => setRecordedAudio(null)}>
                      ✕
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Précédent
            </Button>
            
            {currentStep === exercises.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-[#25d366] hover:bg-[#25d366]/90"
                disabled={
                  (currentExercise.type === 'text' && !answers[currentStep].trim()) ||
                  (currentExercise.type === 'audio' && !recordedAudio)
                }
              >
                Soumettre l'exercice
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  (currentExercise.type === 'text' && !answers[currentStep].trim()) ||
                  (currentExercise.type === 'audio' && !recordedAudio)
                }
              >
                Suivant
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Card className="bg-[#25d366]/5">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Aide :</strong> Une fois votre exercice soumis, le professeur le corrigera et vous enverra ses commentaires. 
            Vous devrez obtenir sa validation pour débloquer la leçon suivante.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonExercise;
