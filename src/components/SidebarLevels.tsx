
import { Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
interface SidebarLevelsProps {
  levels: Level[];
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson) => void;
  sidebarCollapsed: boolean;
  navigate: (url: string) => void;
  formation: { title: string; instructor: string };
}

const SidebarLevels = ({
  levels,
  selectedLesson,
  setSelectedLesson,
  sidebarCollapsed,
  navigate,
  formation,
}: SidebarLevelsProps) => (
  <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-[#202c33] border-r border-[#313d44] transition-all duration-300 flex flex-col`}>
    {/* Header */}
    <div className="p-4 border-b border-[#313d44] bg-[#202c33]">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/courses')} className="text-[#8696a0] hover:text-white">
          <Play className="w-4 h-4" />
        </Button>
        {!sidebarCollapsed && (
          <div className="flex-1">
            <h2 className="font-semibold text-white">{formation.title}</h2>
            <p className="text-sm text-[#8696a0]">{formation.instructor}</p>
          </div>
        )}
      </div>
    </div>
    {/* Levels and Lessons */}
    <div className="flex-1 overflow-y-auto">
      {levels.map((level) => (
        <div key={level.id} className="border-b border-[#313d44]">
          <div className="p-3 bg-[#202c33]">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <>
                  <h3 className="font-medium text-white">{level.title}</h3>
                  {level.unreadMessages > 0 && (
                    <span className="bg-[#25d366] text-black text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium">
                      {level.unreadMessages}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="space-y-1">
              {level.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => !lesson.locked && setSelectedLesson(lesson)}
                  className={`p-3 cursor-pointer hover:bg-[#2a3942] transition-colors flex items-center justify-between ${
                    selectedLesson?.id === lesson.id ? 'bg-[#2a3942]' : ''
                  } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    {lesson.locked ? (
                      <Lock className="w-4 h-4 text-[#8696a0]" />
                    ) : (
                      <Play className="w-4 h-4 text-[#25d366]" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{lesson.title}</p>
                      <p className="text-xs text-[#8696a0]">{lesson.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {lesson.unreadMessages > 0 && (
                      <span className="bg-[#25d366] text-black text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-medium">
                        {lesson.unreadMessages}
                      </span>
                    )}
                    {lesson.completed && <div className="w-2 h-2 bg-[#25d366] rounded-full"></div>}
                    {lesson.hasExercise && !lesson.exerciseCompleted && !lesson.locked && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default SidebarLevels;
