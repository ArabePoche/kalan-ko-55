
import { useState } from 'react';
import { ArrowLeft, Play, Lock, Phone, Video, MessageCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'video' | 'exercise'>('video');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const formation = {
    id: '1',
    title: 'Formation Coran Complet',
    instructor: 'Professeur Ahmed'
  };

  const levels: Level[] = [
    {
      id: '1',
      title: 'Niveau 1 - Bases',
      unreadMessages: 5, // Total des messages non-lus de toutes les leçons du niveau
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
    description: `Cette leçon couvre les bases fondamentales de la récitation coranique. 

Vous apprendrez :
- Les règles de base de la prononciation
- L'importance de la respiration
- Les erreurs courantes à éviter
- Des exercices pratiques

Durée recommandée d'étude : 30 minutes
Niveau : Débutant`
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar - WhatsApp style with green accents */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-[#f0f2f5] border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-border bg-[#25d366]/10">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <h2 className="font-semibold text-foreground">{formation.title}</h2>
                <p className="text-sm text-muted-foreground">{formation.instructor}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-[#25d366]">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-[#25d366]">
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Levels and Lessons */}
        <div className="flex-1 overflow-y-auto">
          {levels.map((level) => (
            <div key={level.id} className="border-b border-border">
              <div className="p-3 bg-[#25d366]/5">
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <>
                      <h3 className="font-medium text-foreground">{level.title}</h3>
                      {level.unreadMessages > 0 && (
                        <span className="bg-[#25d366] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
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
                      className={`p-3 cursor-pointer hover:bg-[#25d366]/10 transition-colors flex items-center justify-between ${
                        selectedLesson?.id === lesson.id ? 'bg-[#25d366]/20' : ''
                      } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        {lesson.locked ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Play className="w-4 h-4 text-[#25d366]" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {lesson.unreadMessages > 0 && (
                          <span className="bg-[#25d366] text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedLesson ? (
          <>
            {/* Tab Navigation */}
            <div className="border-b border-border bg-background">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'video' 
                      ? 'border-[#25d366] text-[#25d366]' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Vidéo
                </button>
                {selectedLesson.hasExercise && (
                  <button
                    onClick={() => setActiveTab('exercise')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                      activeTab === 'exercise' 
                        ? 'border-[#25d366] text-[#25d366]' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Exercice
                    {!selectedLesson.exerciseCompleted && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'video' ? (
                <VideoPlayer lesson={lessonData} />
              ) : (
                <LessonExercise 
                  lesson={selectedLesson} 
                  onComplete={() => {
                    // Update lesson completion status
                    console.log('Exercise completed for lesson:', selectedLesson.id);
                  }}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Sélectionnez une leçon</h3>
              <p className="text-muted-foreground">Choisissez une leçon dans le menu de gauche pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationPage;
