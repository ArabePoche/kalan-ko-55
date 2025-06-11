
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  MessageCircle,
  Send
} from 'lucide-react';

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
}

const VideoPlayer = ({ lesson }: VideoPlayerProps) => {
  const [comment, setComment] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');
  const [privateChatMessages, setPrivateChatMessages] = useState([
    {
      id: '1',
      user: 'Vous',
      message: 'Bonjour, j\'ai une question sur cette leçon',
      time: '14:30',
      isStudent: true
    },
    {
      id: '2',
      user: 'Prof. Ahmed',
      message: 'Bonjour ! Je suis là pour vous aider. Quelle est votre question ?',
      time: '14:32',
      isStudent: false
    }
  ]);

  const comments = [
    {
      id: '1',
      author: 'Ahmad M.',
      avatar: '/placeholder.svg',
      content: 'Excellente explication, merci professeur !',
      time: '2h',
      likes: 5
    },
    {
      id: '2',
      author: 'Fatima K.',
      avatar: '/placeholder.svg',
      content: 'Pourriez-vous répéter la partie sur la prononciation ?',
      time: '1h',
      likes: 2
    }
  ];

  const availableTeachers = [
    { id: '1', name: 'Prof. Ahmed', status: 'en ligne', subject: 'Coran', avatar: '/placeholder.svg' },
    { id: '2', name: 'Dr. Hassan', status: 'absent', subject: 'Tafsir', avatar: '/placeholder.svg' },
    { id: '3', name: 'Prof. Aisha', status: 'en ligne', subject: 'Langue arabe', avatar: '/placeholder.svg' }
  ];

  const handleSendComment = () => {
    if (comment.trim()) {
      console.log('Nouveau commentaire:', comment);
      setComment('');
    }
  };

  const handleSendPrivateMessage = () => {
    if (privateMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: 'Vous',
        message: privateMessage,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isStudent: true
      };
      setPrivateChatMessages([...privateChatMessages, newMessage]);
      setPrivateMessage('');
      
      // Simuler une réponse automatique d'un prof après 2 secondes
      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          user: 'Prof. Ahmed',
          message: 'J\'ai bien reçu votre message. Je vais vous répondre dès que possible.',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isStudent: false
        };
        setPrivateChatMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Video Player */}
      <div className="bg-black aspect-video rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
          <p className="text-lg font-medium">{lesson.title}</p>
          <p className="text-sm opacity-70">Durée: {lesson.duration}</p>
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{lesson.title}</h1>
        <div className="text-sm text-muted-foreground">
          {lesson.stats.views.toLocaleString()} vues
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="comments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comments">Commentaires</TabsTrigger>
          <TabsTrigger value="chat">Chat Privé</TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commentaires ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-3">
                <img 
                  src="/placeholder.svg" 
                  alt="Votre avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ajoutez un commentaire..."
                  />
                  <Button size="sm" onClick={handleSendComment} disabled={!comment.trim()}>
                    Commenter
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img 
                      src={comment.avatar} 
                      alt={comment.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Button variant="ghost" size="sm">
                          ❤️ {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          Répondre
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chat Privé avec les Professeurs</CardTitle>
              <p className="text-sm text-muted-foreground">
                Posez vos questions, les professeurs de cette formation vous répondront
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages du chat */}
              <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
                {privateChatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isStudent ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.isStudent 
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

              {/* Input pour nouveau message */}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Posez votre question aux professeurs..."
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendPrivateMessage()}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendPrivateMessage} disabled={!privateMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Professeurs disponibles */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Professeurs de cette formation</h4>
                <div className="space-y-2">
                  {availableTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img 
                            src={teacher.avatar} 
                            alt={teacher.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            teacher.status === 'en ligne' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">{teacher.name}</h5>
                          <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                        </div>
                      </div>
                      
                      <Badge variant={teacher.status === 'en ligne' ? 'default' : 'secondary'} className="text-xs">
                        {teacher.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoPlayer;
