
import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Lock, Phone, Video, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import LessonExercise from './LessonExercise';

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

const FormationPage = () => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoCollapsed, setVideoCollapsed] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formation = {
    id: '1',
    title: 'Formation Coran Complet',
    instructor: 'Professeur Ahmed'
  };

  const levels: Level[] = [
    {
      id: '1',
      title: 'Niveau 1 - Bases',
      unreadMessages: 5,
      lessons: [
        { 
          id: '1-1', 
          title: 'Introduction au Coran', 
          duration: '15:30', 
          completed: true, 
          locked: false,
          unreadMessages: 2,
          hasExercise: true,
          exerciseCompleted: true
        },
        { 
          id: '1-2', 
          title: 'Alphabet arabe', 
          duration: '20:45', 
          completed: false, 
          locked: false,
          unreadMessages: 3,
          hasExercise: true,
          exerciseCompleted: false
        },
        { 
          id: '1-3', 
          title: 'Première sourate', 
          duration: '25:15', 
          completed: false, 
          locked: true,
          unreadMessages: 0,
          hasExercise: true,
          exerciseCompleted: false
        }
      ]
    },
    {
      id: '2',
      title: 'Niveau 2 - Intermédiaire',
      unreadMessages: 1,
      lessons: [
        { 
          id: '2-1', 
          title: 'Règles de lecture', 
          duration: '18:20', 
          completed: false, 
          locked: true,
          unreadMessages: 1,
          hasExercise: true,
          exerciseCompleted: false
        },
        { 
          id: '2-2', 
          title: 'Tajwid débutant', 
          duration: '22:10', 
          completed: false, 
          locked: true,
          unreadMessages: 0,
          hasExercise: true,
          exerciseCompleted: false
        }
      ]
    }
  ];

  const lessonData = {
    id: selectedLesson?.id || '',
    title: selectedLesson?.title || '',
    duration: selectedLesson?.duration || '',
    instructor: {
      name: 'Professeur Ahmed',
      avatar: '/placeholder.svg',
      subscribers: 1250,
      isSubscribed: false
    },
    stats: {
      likes: 89,
      dislikes: 3,
      views: 2340
    },
    description: `Cette leçon couvre les bases fondamentales de la récitation coranique.`
  };

  if (isMobile) {
    // Mobile view - no sidebar, full screen chat
    return (
      <div className="h-screen bg-background flex flex-col">
        {/* Mobile Header */}
        <div className="p-4 border-b border-border bg-[#075e54]">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/courses')} className="text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h2 className="font-semibold text-white">{formation.title}</h2>
              <p className="text-sm text-white/80">{formation.instructor}</p>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-hidden">
          {selectedLesson ? (
            <VideoPlayer 
              lesson={lessonData} 
              videoCollapsed={videoCollapsed}
              setVideoCollapsed={setVideoCollapsed}
              selectedLesson={selectedLesson}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Sélectionnez une leçon</h3>
                <p className="text-muted-foreground">Choisissez une leçon pour commencer</p>
                
                {/* Quick lesson selector for mobile */}
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
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop view - WhatsApp Web style
  return (
    <div className="h-screen bg-[#111b21] flex">
      {/* Sidebar - WhatsApp Web style */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-[#202c33] border-r border-[#313d44] transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-[#313d44] bg-[#202c33]">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/courses')} className="text-[#8696a0] hover:text-white">
              <ArrowLeft className="w-4 h-4" />
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
                        {lesson.completed && (
                          <div className="w-2 h-2 bg-[#25d366] rounded-full"></div>
                        )}
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

      {/* Main Content - Chat Style */}
      <div className="flex-1 flex flex-col bg-[#0b141a]">
        {selectedLesson ? (
          <VideoPlayer 
            lesson={lessonData} 
            videoCollapsed={videoCollapsed}
            setVideoCollapsed={setVideoCollapsed}
            selectedLesson={selectedLesson}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-80 h-80 mx-auto mb-8 bg-[#202c33] rounded-full flex items-center justify-center border border-[#313d44]">
                <MessageCircle className="w-32 h-32 text-[#8696a0]" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">WhatsApp Formation</h3>
              <p className="text-[#8696a0] max-w-md">
                Envoyez et recevez des messages avec vos professeurs.<br />
                Sélectionnez une leçon dans le panneau de gauche pour commencer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationPage;
