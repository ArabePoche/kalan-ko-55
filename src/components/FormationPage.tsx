
import { useState, useEffect } from 'react';
// Import de composants refactorisés
import SidebarLevels from './SidebarLevels';
import LessonSelectorMobile from './LessonSelectorMobile';
import { ArrowLeft, Play, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';

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

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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

  // Pour le composant vidéo/joueur
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
    // Version mobile
    return (
      <div className="h-screen bg-background flex flex-col">
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
                <LessonSelectorMobile levels={levels} setSelectedLesson={setSelectedLesson} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Version desktop
  return (
    <div className="h-screen bg-[#111b21] flex">
      <SidebarLevels
        levels={levels}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
        sidebarCollapsed={sidebarCollapsed}
        navigate={navigate}
        formation={formation}
      />
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
