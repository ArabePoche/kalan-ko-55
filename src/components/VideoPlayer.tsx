import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Play, 
  Send,
  Smile,
  Paperclip,
  Camera,
  Mic,
  MicOff,
  Phone,
  Video,
  Pause,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  BookOpen
} from 'lucide-react';
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
}

const VideoPlayer = ({ lesson, videoCollapsed, setVideoCollapsed, selectedLesson }: VideoPlayerProps) => {
  const [privateMessage, setPrivateMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [showExercise, setShowExercise] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const newMessage = {
          id: Date.now().toString(),
          user: 'Vous',
          message: '🎵 Message vocal (0:03)',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isStudent: true,
          type: 'voice',
          avatar: '/placeholder.svg'
        };
        setPrivateChatMessages(prev => [...prev, newMessage]);
      }, 3000);
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

  const handleCall = (type: 'voice' | 'video') => {
    console.log(`Initiating ${type} call with teacher`);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b141a]">
      {/* Chat Header - WhatsApp style */}
      <div className="bg-[#202c33] border-b border-[#313d44] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={lesson.instructor.avatar} />
              <AvatarFallback className="bg-[#25d366] text-black">
                {lesson.instructor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-white">{lesson.title}</h3>
              <p className="text-sm text-[#8696a0]">
                {lesson.instructor.name} • {lesson.duration}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCall('voice')}
              className="text-[#8696a0] hover:text-white hover:bg-[#2a3942] rounded-full"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCall('video')}
              className="text-[#8696a0] hover:text-white hover:bg-[#2a3942] rounded-full"
            >
              <Video className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Collapsible Video Section */}
      {!videoCollapsed && (
        <div className="bg-black border-b border-[#313d44]">
          <div className="aspect-video flex items-center justify-center relative">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
              <p className="text-lg font-medium">{lesson.title}</p>
              <p className="text-sm opacity-70">Durée: {lesson.duration}</p>
            </div>
            <Button
              onClick={() => setVideoCollapsed(true)}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
              size="sm"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Show Video Button when collapsed */}
      {videoCollapsed && (
        <div className="bg-[#202c33] border-b border-[#313d44] p-2">
          <Button
            onClick={() => setVideoCollapsed(false)}
            variant="ghost"
            className="w-full text-[#8696a0] hover:text-white hover:bg-[#2a3942] justify-start"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Afficher la vidéo
          </Button>
        </div>
      )}

      {/* Exercise Section - if lesson has exercise */}
      {selectedLesson.hasExercise && (
        <div className="bg-[#202c33] border-b border-[#313d44]">
          <Button
            onClick={() => setShowExercise(!showExercise)}
            variant="ghost"
            className="w-full p-4 text-left justify-between text-white hover:bg-[#2a3942]"
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-[#25d366]" />
              <div>
                <p className="font-medium">Exercice de la leçon</p>
                <p className="text-sm text-[#8696a0]">
                  {selectedLesson.exerciseCompleted ? 'Terminé' : 'Non terminé'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {selectedLesson.exerciseCompleted && (
                <CheckCircle className="w-4 h-4 text-[#25d366]" />
              )}
              {showExercise ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </Button>
          
          {showExercise && (
            <div className="p-4 bg-[#0b141a] border-t border-[#313d44]">
              <LessonExercise 
                lesson={selectedLesson} 
                onComplete={() => {
                  console.log('Exercise completed for lesson:', selectedLesson.id);
                  setShowExercise(false);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Messages du chat - Style WhatsApp */}
      <div className="flex-1 overflow-y-auto bg-[#0b141a] p-4">
        <div className="space-y-4">
          {privateChatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isStudent ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
              {!msg.isStudent && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback className="bg-[#25d366] text-black">
                    {msg.user.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-xs px-4 py-2 rounded-lg relative ${
                msg.isStudent 
                  ? 'bg-[#005c4b] text-white rounded-br-sm' 
                  : 'bg-[#202c33] text-white rounded-bl-sm'
              }`}>
                {!msg.isStudent && (
                  <p className="text-xs font-medium mb-1 text-[#25d366]">{msg.user}</p>
                )}
                
                {msg.type === 'voice' ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVoicePlay(msg.id)}
                      className="p-1 h-auto text-white hover:bg-white/10"
                    >
                      {playingVoiceId === msg.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="flex-1 bg-white/20 rounded h-2 relative">
                      <div className="bg-[#25d366] h-full rounded w-1/3"></div>
                    </div>
                    <span className="text-xs">0:03</span>
                  </div>
                ) : (
                  <p className="text-sm break-words">{msg.message}</p>
                )}
                
                <p className="text-xs opacity-70 mt-1 text-right">{msg.time}</p>
              </div>
              
              {msg.isStudent && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.avatar} />
                  <AvatarFallback className="bg-[#8696a0] text-white">V</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Zone de saisie style WhatsApp */}
      <div className="bg-[#202c33] border-t border-[#313d44] p-4">
        {/* Sélecteur d'émojis */}
        {showEmojiPicker && (
          <div className="mb-4 bg-[#2a3942] border border-[#313d44] rounded-lg p-3">
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="p-2 hover:bg-[#202c33] rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input avec boutons style WhatsApp */}
        <div className="flex items-end space-x-2 bg-[#2a3942] rounded-full px-4 py-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="rounded-full p-2 h-auto text-[#8696a0] hover:text-white hover:bg-[#202c33]"
          >
            <Smile className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <textarea
              placeholder="Tapez votre message..."
              value={privateMessage}
              onChange={(e) => setPrivateMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendPrivateMessage())}
              className="w-full resize-none border-none outline-none bg-transparent max-h-20 min-h-6 py-1 text-white placeholder-[#8696a0]"
              rows={1}
              style={{ 
                height: 'auto',
                minHeight: '24px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleFileAttachment}
            className="rounded-full p-2 h-auto text-[#8696a0] hover:text-white hover:bg-[#202c33]"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            className="rounded-full p-2 h-auto text-[#8696a0] hover:text-white hover:bg-[#202c33]"
          >
            <Camera className="w-5 h-5" />
          </Button>

          {privateMessage.trim() ? (
            <Button 
              size="sm" 
              onClick={handleSendPrivateMessage}
              className="rounded-full p-2 h-auto w-10 bg-[#25d366] hover:bg-[#25d366]/90 text-black"
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              variant={isRecording ? "destructive" : "default"}
              size="sm" 
              onClick={handleVoiceRecord}
              className={`rounded-full p-2 h-auto w-10 ${!isRecording ? 'bg-[#25d366] hover:bg-[#25d366]/90 text-black' : ''}`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Professeurs disponibles */}
      <div className="bg-[#202c33] border-t border-[#313d44] p-4">
        <h4 className="text-sm font-medium mb-3 text-white">Professeurs disponibles</h4>
        <div className="flex space-x-3 overflow-x-auto">
          {availableTeachers.map((teacher) => (
            <div key={teacher.id} className="flex-shrink-0 text-center">
              <div className="relative mb-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={teacher.avatar} />
                  <AvatarFallback className="bg-[#8696a0] text-white">
                    {teacher.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#202c33] ${
                  teacher.status === 'en ligne' ? 'bg-[#25d366]' : 'bg-[#8696a0]'
                }`} />
              </div>
              <p className="text-xs text-[#8696a0] max-w-16 truncate">{teacher.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
