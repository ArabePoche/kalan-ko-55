
import { Play, Lock } from 'lucide-react';

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
interface Level {
  id: string;
  title: string;
  lessons: Lesson[];
  unreadMessages: number;
}
interface LessonSelectorMobileProps {
  levels: Level[];
  setSelectedLesson: (lesson: Lesson) => void;
}

const LessonSelectorMobile = ({ levels, setSelectedLesson }: LessonSelectorMobileProps) => (
  <div className="mt-6 space-y-4 max-w-sm">
    {levels.map((level) => (
      <div key={level.id}>
        <h4 className="text-sm font-medium text-left mb-2">{level.title}</h4>
        <div className="space-y-2">
          {level.lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => !lesson.locked && setSelectedLesson(lesson)}
              disabled={lesson.locked}
              className="w-full p-3 text-left border rounded-lg hover:bg-muted disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                </div>
                {lesson.locked ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#25d366]" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default LessonSelectorMobile;
