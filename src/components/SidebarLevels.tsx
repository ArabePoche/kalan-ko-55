
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  Lock, 
  CheckCircle,
  MessageCircle,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

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

interface Formation {
  id: string;
  title: string;
  instructor: string;
  price: number;
  description: string;
}

interface SidebarLevelsProps {
  levels: Level[];
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson) => void;
  sidebarCollapsed: boolean;
  navigate: (path: string) => void;
  formation: Formation;
  hasAccess: boolean;
}

const SidebarLevels = ({ 
  levels, 
  selectedLesson, 
  setSelectedLesson, 
  sidebarCollapsed,
  navigate, 
  formation, 
  hasAccess 
}: SidebarLevelsProps) => {
  const [openLevels, setOpenLevels] = useState<string[]>(['1']);
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const toggleLevel = (levelId: string) => {
    setOpenLevels(prev => 
      prev.includes(levelId) 
        ? prev.filter(id => id !== levelId)
        : [...prev, levelId]
    );
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!hasAccess || lesson.locked) return;
    setSelectedLesson(lesson);
  };

  const totalLessons = levels.reduce((total, level) => total + level.lessons.length, 0);
  const completedLessons = levels.reduce((total, level) => 
    total + level.lessons.filter(lesson => lesson.completed).length, 0
  );
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Si la sidebar est réduite, ne pas afficher
  if (sidebarCollapsed || internalCollapsed) {
    return null;
  }

  return (
    <div className="w-80 bg-[#111b21] border-r border-[#313d44] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#313d44] bg-[#202c33]">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-[#8696a0] hover:text-white hover:bg-[#313d44]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInternalCollapsed(true)}
            className="text-[#8696a0] hover:text-white hover:bg-[#313d44]"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="text-white">
          <h2 className="font-semibold text-lg mb-1">{formation.title}</h2>
          <p className="text-[#8696a0] text-sm mb-3">{formation.instructor}</p>
          
          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-[#8696a0]">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-[#313d44] rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[#8696a0]">
              {completedLessons} sur {totalLessons} leçons terminées
            </p>
          </div>
        </div>
      </div>

      {/* Liste des niveaux et leçons */}
      <div className="flex-1 overflow-y-auto">
        {levels.map((level) => (
          <Collapsible
            key={level.id}
            open={openLevels.includes(level.id)}
            onOpenChange={() => toggleLevel(level.id)}
          >
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-[#202c33] transition-colors border-b border-[#313d44] group">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {openLevels.includes(level.id) ? (
                    <ChevronDown className="w-4 h-4 text-[#8696a0]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#8696a0]" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-medium group-hover:text-[#00a884] transition-colors">
                    {level.title}
                  </h3>
                  <p className="text-[#8696a0] text-sm">
                    {level.lessons.length} leçon{level.lessons.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {level.unreadMessages > 0 && (
                <div className="bg-[#00a884] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {level.unreadMessages}
                </div>
              )}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="bg-[#0b141a]">
              {level.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  disabled={!hasAccess || lesson.locked}
                  className={`w-full p-3 px-6 flex items-center space-x-3 hover:bg-[#202c33] transition-colors border-b border-[#313d44] group ${
                    selectedLesson?.id === lesson.id ? 'bg-[#202c33] border-l-4 border-l-[#00a884]' : ''
                  } ${(!hasAccess || lesson.locked) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex-shrink-0">
                    {lesson.locked ? (
                      <Lock className="w-4 h-4 text-[#8696a0]" />
                    ) : lesson.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Play className="w-4 h-4 text-[#8696a0] group-hover:text-[#00a884] transition-colors" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h4 className={`text-white text-sm font-medium group-hover:text-[#00a884] transition-colors ${
                      selectedLesson?.id === lesson.id ? 'text-[#00a884]' : ''
                    }`}>
                      {lesson.title}
                    </h4>
                    <p className="text-[#8696a0] text-xs">{lesson.duration}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {lesson.unreadMessages > 0 && (
                      <div className="bg-[#00a884] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {lesson.unreadMessages}
                      </div>
                    )}
                    {lesson.hasExercise && (
                      <div className={`w-2 h-2 rounded-full ${
                        lesson.exerciseCompleted ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                    )}
                  </div>
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default SidebarLevels;
