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
  timeLeft?: number; // Ajout: pour le timer
}

const VideoPlayer = ({ lesson, videoCollapsed, setVideoCollapsed, selectedLesson, timeLeft }: VideoPlayerProps) => {
  const [privateMessage, setPrivateMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showExercise, setShowExercise] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraMode, setCameraMode] = useState<"menu" | "photo" | "video">("menu");
  const [callModal, setCallModal] = useState<{ open: boolean; type: "voice" | "video" } | null>(null);

  // Handler to open voice or video call
  const handleCall = (type: "voice" | "video") => {
    setCallModal({ open: true, type });
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
        if (t <= 0.02) { // ~1s de marge
          clearInterval(interval);
          return 0;
        }
        return t - 1 / 60;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [localTimeLeft]);

  // -- Limite le temps d'enregistrement vocal à 3 minutes
  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Timer fixé à 3 minutes (180000 ms)
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
          // Pour la vraie implémentation, ajouter le blob d’audio ici
        };
        setPrivateChatMessages(prev => [...prev, newMessage]);
      }, 180000); // 3 minutes

      // Clean-up si interruption manuelle
      const stopEarly = () => {
        clearTimeout(recordTimeout);
        setIsRecording(false);
      };
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

  // ==> Nouveau handler pour capture caméra (photo/vidéo)
  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      let label = 'Photo';
      if (isVideo) label = 'Vidéo';
      if (isImage) label = 'Photo';
      // On affiche un message spécifique selon le type 
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

  // Handler Caméra bouton : ouvre le menu photo/vidéo dans la modale
  const handleCameraButton = () => {
    setCameraMode("menu");
    setShowCameraModal(true);
  };

  // Handler pour prise photo
  const handleCameraPhotoCaptured = (imageData: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: "Vous",
      message: "📷 Photo prise",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isStudent: true,
      type: "image",
      avatar: "/placeholder.svg",
      imageData // base64
    };
    setPrivateChatMessages((prev) => [...prev, newMessage]);
  };

  // Handler pour vidéo
  const handleCameraVideoCaptured = (videoUrl: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: "Vous",
      message: "📹 Vidéo envoyée",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isStudent: true,
      type: "video",
      avatar: "/placeholder.svg",
      videoUrl // blob url
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
      <div className="flex-shrink-0">
        <ChatHeader
          lessonTitle={lesson.title}
          lessonDuration={lesson.duration}
          instructor={lesson.instructor}
          onCall={handleCall}
        />
        <VideoSection
          visible={!videoCollapsed}
          onToggle={() => setVideoCollapsed(!videoCollapsed)}
          lessonTitle={lesson.title}
          lessonDuration={lesson.duration}
        />
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
      
      <div className="flex-1 overflow-y-auto bg-[#0b141a] p-3 md:p-4">
        <ChatMessages
          messages={privateChatMessages}
          playingVoiceId={playingVoiceId}
          onVoicePlay={handleVoicePlay}
        />
      </div>
      <div className="flex-shrink-0">
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
          // Props pour gestion caméra dans input
          onCameraCapture={() => null}
          cameraInputRef={cameraInputRef}
          onCameraButton={handleCameraButton}
        />
        <AvailableTeachers teachers={availableTeachers} />
      </div>
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
