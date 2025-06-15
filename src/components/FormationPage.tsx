import { useState, useEffect } from 'react';
// Import de composants refactorisés
import SidebarLevels from './SidebarLevels';
import LessonSelectorMobile from './LessonSelectorMobile';
import TemporaryAccessBanner from './TemporaryAccessBanner';
import TeachersList from './TeachersList'; // ← AJOUT
import { ArrowLeft, Play, MessageCircle, ShoppingCart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { toast } from '@/hooks/use-toast';
import { useTemporaryAccess } from '@/hooks/useTemporaryAccess';
// --- Ajout des imports refactor ---
import FormationMobileHeader from './FormationMobileHeader';
import FormationDesktopHeader from './FormationDesktopHeader';

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
  const { id: formationId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoCollapsed, setVideoCollapsed] = useState(false);
  const { hasTemporaryAccess, grantTemporaryAccess } = useTemporaryAccess();

  // Vérifier l'accès temporaire
  const accessInfo = hasTemporaryAccess(formationId || '');
  const hasAccess = accessInfo.hasAccess;
  const timeLeft = accessInfo.timeLeft;

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formation = {
    id: formationId || '1',
    title: 'Formation Coran Complet',
    instructor: 'Professeur Ahmed',
    price: 49.99,
    description: 'Apprenez les bases de la lecture du Coran avec cette formation complète.'
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

  const handleOrderClick = () => {
    navigate(`/order/${formation.id}`);
    toast({
      title: "Redirection vers la commande",
      description: "Vous allez être redirigé vers la page de commande.",
    });
  };

  const handleStartTrial = () => {
    if (formationId) {
      grantTemporaryAccess(formationId, 15);
      toast({
        title: "Accès temporaire accordé!",
        description: "Vous avez maintenant 15 minutes d'accès à cette formation.",
      });
    }
  };

  const handleAccessExpired = () => {
    setSelectedLesson(null);
    toast({
      title: "Accès expiré",
      description: "Votre temps d'accès temporaire est terminé. Passez commande pour continuer.",
      variant: "destructive"
    });
  };

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
    // Version mobile améliorée
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden" style={{ scrollBehavior: 'smooth' }}>
        <FormationMobileHeader
          title={formation.title}
          instructor={formation.instructor}
          onOrderClick={handleOrderClick}
        />
        <div className="p-4" style={{ scrollBehavior: 'smooth' }}>
          {/* Affichage TEACHERS (mobile) */}
          <TeachersList formationId={formationId || '1'} />
          {hasAccess && !selectedLesson && (
            <TemporaryAccessBanner 
              timeLeft={timeLeft} 
              onExpired={handleAccessExpired}
            />
          )}
        </div>
        <div className="flex-1 overflow-hidden" style={{ scrollBehavior: 'smooth' }}>
          {hasAccess ? (
            selectedLesson ? (
              <VideoPlayer 
                lesson={lessonData} 
                videoCollapsed={videoCollapsed}
                setVideoCollapsed={setVideoCollapsed}
                selectedLesson={selectedLesson}
                timeLeft={timeLeft}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center max-w-sm mx-auto">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Sélectionnez une leçon</h3>
                  <p className="text-muted-foreground text-sm mb-4">Choisissez une leçon pour commencer</p>
                  <LessonSelectorMobile levels={levels} setSelectedLesson={setSelectedLesson} />
                </div>
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-sm mx-auto">
                <Play className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Accès requis</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Démarrez un essai gratuit de 15 minutes ou passez commande pour accéder à cette formation.
                </p>
                <div className="space-y-2">
                  <Button onClick={handleStartTrial} className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Essai gratuit 15min
                  </Button>
                  <Button onClick={handleOrderClick} variant="outline" className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Passer commande
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Version desktop
  return (
    <div className="h-screen bg-[#111b21] flex" style={{ scrollBehavior: 'smooth' }}>
      <SidebarLevels
        levels={levels}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
        sidebarCollapsed={sidebarCollapsed}
        navigate={navigate}
        formation={formation}
        hasAccess={hasAccess}
      />
      <div className="flex-1 flex flex-col bg-[#0b141a]" style={{ scrollBehavior: 'smooth' }}>
        {/* Header desktop factorisé */}
        <FormationDesktopHeader
          title={formation.title}
          description={formation.description}
          price={formation.price}
          hasAccess={hasAccess}
          onOrderClick={handleOrderClick}
          onStartTrial={handleStartTrial}
        />
        {/* Affichage TEACHERS (desktop) */}
        <TeachersList formationId={formationId || '1'} />
        {hasAccess && !selectedLesson && (
          <TemporaryAccessBanner 
            timeLeft={timeLeft} 
            onExpired={handleAccessExpired}
          />
        )}
        {hasAccess ? (
          selectedLesson ? (
            <VideoPlayer 
              lesson={lessonData} 
              videoCollapsed={videoCollapsed}
              setVideoCollapsed={setVideoCollapsed}
              selectedLesson={selectedLesson}
              timeLeft={timeLeft}
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
          )
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-80 h-80 mx-auto mb-8 bg-[#202c33] rounded-full flex items-center justify-center border border-[#313d44]">
                <ShoppingCart className="w-32 h-32 text-[#8696a0]" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">Accès requis</h3>
              <p className="text-[#8696a0] max-w-md mb-6">
                Démarrez un essai gratuit de 15 minutes ou passez commande pour accéder à cette formation complète.
              </p>
              <div className="flex space-x-4 justify-center">
                <Button onClick={handleStartTrial} className="bg-orange-600 hover:bg-orange-700">
                  <Clock className="w-4 h-4 mr-2" />
                  Essai gratuit 15min
                </Button>
                <Button onClick={handleOrderClick} className="bg-primary hover:bg-primary/90">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Passer commande
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationPage;
