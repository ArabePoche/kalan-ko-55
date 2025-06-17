import { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import VideoSection from './VideoSection';
import ExerciseSection from './ExerciseSection';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import AvailableTeachers from './AvailableTeachers';
import CameraCaptureModal from "./CameraCaptureModal";
import CallModal from './CallModal';
import LessonCallHandler from './LessonCallHandler';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

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

interface VideoPlayerProps {
  lesson: {
    id: string;
    title: string;
    duration: string;
    instructor: {
      name: string;
      avatar: string;
      subscribers: number;
      isSubscribed: boolean;
    };
    stats: {
      likes: number;
      dislikes: number;
      views: number;
    };
    description: string;
  };
  videoCollapsed: boolean;
  setVideoCollapsed: (collapsed: boolean) => void;
  selectedLesson: Lesson;
  timeLeft?: number;
}

const VideoPlayer = ({ lesson, videoCollapsed, setVideoCollapsed, selectedLesson, timeLeft }: VideoPlayerProps) => {
  const [privateMessage, setPrivateMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showExercise, setShowExercise] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraMode, setCameraMode] = useState<"menu" | "photo" | "video">("menu");
  const [callModal, setCallModal] = useState<{ open: boolean; type: "voice" | "video" } | null>(null);

  // Handler to open voice or video call
  const handleCall = (type: "voice" | "video") => {
    setCallModal({ open: true, type });
  };

  // Surveiller le défilement pour afficher/masquer le bouton "remonter"
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current && videoSectionRef.current) {
        const chatContainer = chatContainerRef.current;
        const videoSection = videoSectionRef.current;
        const videoBottom = videoSection.offsetTop + videoSection.offsetHeight;
        
        // Afficher le bouton si on a défilé au-delà de la vidéo
        setShowScrollToTop(chatContainer.scrollTop > videoBottom);
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Fonction pour remonter à la vidéo
  const scrollToVideo = () => {
    if (videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const [privateChatMessages, setPrivateChatMessages] = useState([
    {
      id: '1',
      user: 'Vous',
      message: 'Bonjour, j\'ai une question sur cette leçon',
      time: '14:30',
      isStudent: true,
      type: 'text',
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      user: 'Prof. Ahmed',
      message: 'Bonjour ! Je suis là pour vous aider. Quelle est votre question ?',
      time: '14:32',
      isStudent: false,
      type: 'text',
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      user: 'Vous',
      message: '🎵 Message vocal (0:03)',
      time: '14:35',
      isStudent: true,
      type: 'voice',
      avatar: '/placeholder.svg'
    },
    {
      id: '4',
      user: 'Prof. Ahmed',
      message: 'Excellente prononciation ! Continuez comme ça.',
      time: '14:37',
      isStudent: false,
      type: 'text',
      avatar: '/placeholder.svg'
    }
  ]);

  const availableTeachers = [
    { id: '1', name: 'Prof. Ahmed', status: 'en ligne', subject: 'Coran', avatar: '/placeholder.svg' },
    { id: '2', name: 'Dr. Hassan', status: 'absent', subject: 'Tafsir', avatar: '/placeholder.svg' },
    { id: '3', name: 'Prof. Aisha', status: 'en ligne', subject: 'Langue arabe', avatar: '/placeholder.svg' }
  ];

  const emojis = ['😊', '😂', '❤️', '👍', '👎', '😍', '😢', '😮', '😡', '🤔', '👏', '🙏'];

  const handleSendPrivateMessage = () => {
    if (privateMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: 'Vous',
        message: privateMessage,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isStudent: true,
        type: 'text',
        avatar: '/placeholder.svg'
      };
      setPrivateChatMessages([...privateChatMessages, newMessage]);
      setPrivateMessage('');

      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          user: 'Prof. Ahmed',
          message: 'J\'ai bien reçu votre message. Je vais vous répondre dès que possible.',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isStudent: false,
          type: 'text',
          avatar: '/placeholder.svg'
        };
        setPrivateChatMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setPrivateMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newMessage = {
        id: Date.now().toString(),
        user: 'Vous',
        message: `📎 ${file.name}`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isStudent: true,
        type: 'file',
        avatar: '/placeholder.svg'
      };
      setPrivateChatMessages([...privateChatMessages, newMessage]);
    }
  };

  // Affichage du timer si timeLeft fourni (accès temporaire)
  const [localTimeLeft, setLocalTimeLeft] = useState(timeLeft || 0);

  useEffect(() => {
    if (typeof timeLeft === "number") setLocalTimeLeft(timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    if (typeof localTimeLeft !== "number" || localTimeLeft <= 0) return;
    const interval = setInterval(() => {
      setLocalTimeLeft((t) => {
        if (t <= 0.02) {
          clearInterval(interval);
          return 0;
        }
        return t - 1 / 60;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [localTimeLeft]);

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      const recordTimeout = setTimeout(() => {
        setIsRecording(false);
        const newMessage = {
          id: Date.now().toString(),
          user: 'Vous',
          message: '🎵 Message vocal (3:00)',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isStudent: true,
          type: 'voice',
          avatar: '/placeholder.svg',
        };
        setPrivateChatMessages(prev => [...prev, newMessage]);
      }, 180000);
    } else {
      setIsRecording(false);
    }
  };

  const handleVoicePlay = (messageId: string) => {
    if (playingVoiceId === messageId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(messageId);
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 3000);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      let label = 'Photo';
      if (isVideo) label = 'Vidéo';
      if (isImage) label = 'Photo';
      const newMessage = {
        id: Date.now().toString(),
        user: 'Vous',
        message: `📷 ${label} prise`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isStudent: true,
        type: isImage ? 'image' : 'video',
        avatar: '/placeholder.svg'
      };
      setPrivateChatMessages([...privateChatMessages, newMessage]);
    }
  };

  const handleCameraButton = () => {
    setCameraMode("menu");
    setShowCameraModal(true);
  };

  const handleCameraPhotoCaptured = (imageData: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: "Vous",
      message: "📷 Photo prise",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isStudent: true,
      type: "image",
      avatar: "/placeholder.svg",
      imageData
    };
    setPrivateChatMessages((prev) => [...prev, newMessage]);
  };

  const handleCameraVideoCaptured = (videoUrl: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: "Vous",
      message: "📹 Vidéo envoyée",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isStudent: true,
      type: "video",
      avatar: "/placeholder.svg",
      videoUrl
    };
    setPrivateChatMessages((prev) => [...prev, newMessage]);
  };

  // Calcul timer format
  let timerElement: React.ReactNode = null;
  if (typeof localTimeLeft === "number" && localTimeLeft > 0) {
    const min = Math.floor(localTimeLeft);
    const sec = Math.floor((localTimeLeft - min) * 60);
    const isLow = localTimeLeft < 5;
    timerElement = (
      <div className={`absolute top-2 right-2 z-30 px-3 py-1 rounded-lg shadow font-semibold text-xs flex items-center
        ${isLow ? "bg-red-600 text-white" : "bg-orange-500 text-white"} opacity-90`}>
        ⏳ Accès temporaire {min}:{sec.toString().padStart(2, '0')}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-[#0b141a] overflow-hidden">
      {/* Overlay vrai appel */}
      <LessonCallHandler
        open={!!callModal?.open}
        type={callModal?.type || "voice"}
        instructor={lesson.instructor}
        onClose={() => setCallModal(null)}
      />
      {timerElement}
      
      {/* Container principal avec défilement */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto bg-[#0b141a]">
        {/* Header fixe */}
        <div className="sticky top-0 z-20 bg-[#0b141a]">
          <ChatHeader
            lessonTitle={lesson.title}
            lessonDuration={lesson.duration}
            instructor={lesson.instructor}
            onCall={handleCall}
          />
        </div>

        {/* Section vidéo intégrée en haut du chat */}
        <div ref={videoSectionRef} className="flex-shrink-0">
          <VideoSection
            visible={true}
            onToggle={() => {}} // Pas de toggle, toujours visible
            lessonTitle={lesson.title}
            lessonDuration={lesson.duration}
          />
        </div>

        {/* Section exercices si applicable */}
        {selectedLesson.hasExercise && (
          <div className="flex-shrink-0">
            <ExerciseSection
              hasExercise={selectedLesson.hasExercise}
              exerciseCompleted={selectedLesson.exerciseCompleted}
              showExercise={showExercise}
              onToggle={() => setShowExercise(!showExercise)}
              onComplete={() => {
                console.log('Exercise completed for lesson:', selectedLesson.id);
                setShowExercise(false);
              }}
              lesson={selectedLesson}
            />
          </div>
        )}
        
        {/* Messages du chat */}
        <div className="flex-1 p-3 md:p-4 min-h-96">
          <ChatMessages
            messages={privateChatMessages}
            playingVoiceId={playingVoiceId}
            onVoicePlay={handleVoicePlay}
          />
        </div>
      </div>

      {/* Input de chat fixe en bas */}
      <div className="flex-shrink-0 sticky bottom-0 bg-[#0b141a]">
        <ChatInput
          privateMessage={privateMessage}
          setPrivateMessage={setPrivateMessage}
          isRecording={isRecording}
          showEmojiPicker={showEmojiPicker}
          emojis={emojis}
          onToggleEmojiPicker={() => setShowEmojiPicker((state) => !state)}
          onSend={handleSendPrivateMessage}
          onFileAttachment={handleFileAttachment}
          onFileSelect={handleFileSelect}
          onVoiceRecord={handleVoiceRecord}
          setIsRecording={setIsRecording}
          fileInputRef={fileInputRef}
          onCameraCapture={() => null}
          cameraInputRef={cameraInputRef}
          onCameraButton={handleCameraButton}
        />
        <AvailableTeachers teachers={availableTeachers} />
      </div>

      {/* Bouton flottant pour remonter à la vidéo */}
      {showScrollToTop && (
        <Button
          onClick={scrollToVideo}
          className="fixed bottom-24 right-6 z-40 bg-primary hover:bg-primary/90 text-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 animate-fade-in"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      {/* Modale caméra avancée */}
      <CameraCaptureModal
        open={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraPhotoCaptured}
        onVideoCapture={handleCameraVideoCaptured}
        mode={cameraMode}
        setMode={setCameraMode}
      />
    </div>
  );
};
export default VideoPlayer;

// 
// ⚠️ Ce fichier commence à être long (près de 300 lignes), pense à demander une refacto dès que possible !
