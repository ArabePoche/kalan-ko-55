import { useState } from 'react';
import { ArrowLeft, Send, Paperclip, Mic, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  videoUrl?: string;
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
  const [message, setMessage] = useState('');
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
      unreadMessages: 2,
      lessons: [
        { id: '1-1', title: 'Introduction au Coran', duration: '15:30', completed: true, locked: false },
        { id: '1-2', title: 'Alphabet arabe', duration: '20:45', completed: false, locked: false },
        { id: '1-3', title: 'Première sourate', duration: '25:15', completed: false, locked: true }
      ]
    },
    {
      id: '2',
      title: 'Niveau 2 - Intermédiaire',
      unreadMessages: 0,
      lessons: [
        { id: '2-1', title: 'Règles de lecture', duration: '18:20', completed: false, locked: true },
        { id: '2-2', title: 'Tajwid débutant', duration: '22:10', completed: false, locked: true }
      ]
    }
  ];

  const messages = [
    { id: '1', user: 'Ahmed S.', message: 'Comment bien prononcer cette lettre ?', time: '14:30', isTeacher: false },
    { id: '2', user: 'Prof. Ahmed', message: 'Excellent question ! Regardez attentivement ma bouche dans la vidéo...', time: '14:32', isTeacher: true },
    { id: '3', user: 'Fatima M.', message: 'Merci pour cette explication claire !', time: '14:35', isTeacher: false }
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

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar - WhatsApp style */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-secondary border-r border-border transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-semibold text-foreground">{formation.title}</h2>
                <p className="text-sm text-muted-foreground">{formation.instructor}</p>
              </div>
            )}
          </div>
        </div>

        {/* Levels and Lessons */}
        <div className="flex-1 overflow-y-auto">
          {levels.map((level) => (
            <div key={level.id} className="border-b border-border">
              <div className="p-3 bg-accent/50">
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <>
                      <h3 className="font-medium text-foreground">{level.title}</h3>
                      {level.unreadMessages > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
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
                      className={`p-3 cursor-pointer hover:bg-accent/30 transition-colors flex items-center justify-between ${
                        selectedLesson?.id === lesson.id ? 'bg-accent' : ''
                      } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        {lesson.locked ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Play className="w-4 h-4 text-primary" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </div>
                      {lesson.completed && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
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
            {/* Video Section with YouTube-style player */}
            <div className="flex-1 overflow-y-auto p-6">
              <VideoPlayer lesson={lessonData} />
            </div>

            {/* Chat Section */}
            <div className="border-t border-border">
              {/* Messages */}
              <div className="h-48 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isTeacher ? 'justify-start' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isTeacher 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-foreground'
                    }`}>
                      <p className="text-xs font-medium mb-1">{msg.user}</p>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Posez votre question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
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
