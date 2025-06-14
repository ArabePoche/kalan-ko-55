
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, ChevronUp, ChevronDown } from "lucide-react";
import LessonExercise from "./LessonExercise";

interface ExerciseSectionProps {
  hasExercise: boolean;
  exerciseCompleted: boolean;
  showExercise: boolean;
  onToggle: () => void;
  onComplete: () => void;
  lesson: any; // Use type from Lesson if available in your project
}

const ExerciseSection = ({
  hasExercise,
  exerciseCompleted,
  showExercise,
  onToggle,
  onComplete,
  lesson,
}: ExerciseSectionProps) =>
  hasExercise ? (
    <div className="bg-[#202c33] border-b border-[#313d44]">
      <Button
        onClick={onToggle}
        variant="ghost"
        className="w-full p-4 text-left justify-between text-white hover:bg-[#2a3942]"
      >
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-[#25d366]" />
          <div>
            <p className="font-medium">Exercice de la leçon</p>
            <p className="text-sm text-[#8696a0]">
              {exerciseCompleted ? 'Terminé' : 'Non terminé'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {exerciseCompleted && (
            <CheckCircle className="w-4 h-4 text-[#25d366]" />
          )}
          {showExercise ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </Button>
      {showExercise && (
        <div className="p-4 bg-[#0b141a] border-t border-[#313d44]">
          <LessonExercise lesson={lesson} onComplete={onComplete} />
        </div>
      )}
    </div>
  ) : null;

export default ExerciseSection;
