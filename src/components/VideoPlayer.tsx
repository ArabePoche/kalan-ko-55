import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Play, 
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  Camera,
  Mic,
  MicOff,
  Phone,
  Video,
  Pause
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
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
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

  const emojis = ['😊', '😂', '❤️', '👍', '👎', '😍', '😢', '😮', '😡', '🤔', '👏', '🙏'];

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
        isStudent: true,
        type: 'text',
        avatar: '/placeholder.svg'
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
      console.log('Début de l\'enregistrement vocal');
      // Simuler l'arrêt de l'enregistrement après 3 secondes
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
      // Simulate playing for 3 seconds
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 3000);
    }
  };

  const handleCall = (type: 'voice' | 'video') => {
    console.log(`Initiating ${type} call with teacher`);
    // Here you would implement the actual call functionality
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
            <CardHeader className="pb-3 bg-[#25d366]/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#25d366] rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Chat avec les Professeurs</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Posez vos questions, les professeurs vous répondront
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCall('voice')}
                    className="text-[#25d366] hover:bg-[#25d366]/10"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCall('video')}
                    className="text-[#25d366] hover:bg-[#25d366]/10"
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages du chat - Style WhatsApp avec avatars */}
              <div className="h-80 overflow-y-auto bg-[#efeae2] rounded-lg p-4 space-y-3">
                {privateChatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isStudent ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
                    {!msg.isStudent && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-xs px-4 py-2 rounded-lg relative ${
                      msg.isStudent 
                        ? 'bg-[#dcf8c6] text-foreground rounded-br-sm' 
                        : 'bg-white text-foreground border rounded-bl-sm shadow-sm'
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
                            className="p-1 h-auto"
                          >
                            {playingVoiceId === msg.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <div className="flex-1 bg-muted/50 rounded h-2 relative">
                            <div className="bg-[#25d366] h-full rounded w-1/3"></div>
                          </div>
                          <span className="text-xs">0:03</span>
                        </div>
                      ) : (
                        <p className="text-sm break-words">{msg.message}</p>
                      )}
                      
                      <p className="text-xs opacity-70 mt-1 text-right">{msg.time}</p>
                      
                      {/* Petite flèche style WhatsApp */}
                      <div className={`absolute top-0 w-0 h-0 ${
                        msg.isStudent 
                          ? 'right-0 border-l-8 border-l-[#dcf8c6] border-t-8 border-t-transparent' 
                          : 'left-0 border-r-8 border-r-white border-t-8 border-t-transparent'
                      }`} />
                    </div>
                    
                    {msg.isStudent && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>V</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>

              {/* Zone de saisie style WhatsApp */}
              <div className="space-y-3">
                {/* Sélecteur d'émojis */}
                {showEmojiPicker && (
                  <div className="bg-background border rounded-lg p-3">
                    <div className="grid grid-cols-6 gap-2">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiSelect(emoji)}
                          className="p-2 hover:bg-muted rounded text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input avec boutons style WhatsApp */}
                <div className="flex items-end space-x-2 bg-background border rounded-full px-4 py-2">
                  {/* Bouton émojis */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="rounded-full p-2 h-auto"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>

                  {/* Zone de texte */}
                  <div className="flex-1">
                    <textarea
                      placeholder="Tapez votre message..."
                      value={privateMessage}
                      onChange={(e) => setPrivateMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendPrivateMessage())}
                      className="w-full resize-none border-none outline-none bg-transparent max-h-20 min-h-6 py-1"
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

                  {/* Bouton pièce jointe / caméra */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleFileAttachment}
                    className="rounded-full p-2 h-auto"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="rounded-full p-2 h-auto"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>

                  {/* Bouton dynamique : Envoyer ou Vocal */}
                  {privateMessage.trim() ? (
                    <Button 
                      size="sm" 
                      onClick={handleSendPrivateMessage}
                      className="rounded-full p-2 h-auto w-10 bg-[#25d366] hover:bg-[#25d366]/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant={isRecording ? "destructive" : "default"}
                      size="sm" 
                      onClick={handleVoiceRecord}
                      className={`rounded-full p-2 h-auto w-10 ${!isRecording ? 'bg-[#25d366] hover:bg-[#25d366]/90' : ''}`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  )}
                </div>

                {/* Input caché pour les fichiers */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Professeurs disponibles */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Professeurs de cette formation</h4>
                <div className="space-y-2">
                  {availableTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img 
                            src={teacher.avatar} 
                            alt={teacher.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            teacher.status === 'en ligne' ? 'bg-[#25d366]' : 'bg-gray-400'
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
