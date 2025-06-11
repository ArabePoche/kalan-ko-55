
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ThumbsUp, 
  ThumbsDown, 
  Bell, 
  Share, 
  MessageCircle,
  Upload,
  CheckCircle,
  Clock
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
  const [isSubscribed, setIsSubscribed] = useState(lesson.instructor.isSubscribed);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [exerciseFile, setExerciseFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');

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
    { id: '1', name: 'Prof. Ahmed', status: 'en ligne', subject: 'Coran' },
    { id: '2', name: 'Dr. Hassan', status: 'absent', subject: 'Tafsir' },
    { id: '3', name: 'Prof. Aisha', status: 'en ligne', subject: 'Langue arabe' }
  ];

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
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {lesson.stats.views.toLocaleString()} vues
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={liked ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setLiked(!liked);
                if (disliked) setDisliked(false);
              }}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {lesson.stats.likes + (liked ? 1 : 0)}
            </Button>
            
            <Button
              variant={disliked ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setDisliked(!disliked);
                if (liked) setLiked(false);
              }}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              {lesson.stats.dislikes + (disliked ? 1 : 0)}
            </Button>
            
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-1" />
              Partager
            </Button>
          </div>
        </div>

        {/* Instructor Info */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <img 
              src={lesson.instructor.avatar} 
              alt={lesson.instructor.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{lesson.instructor.name}</h3>
              <p className="text-sm text-muted-foreground">
                {lesson.instructor.subscribers.toLocaleString()} abonnés
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsSubscribed(!isSubscribed)}
            variant={isSubscribed ? "outline" : "default"}
          >
            <Bell className="w-4 h-4 mr-2" />
            {isSubscribed ? 'Abonné' : "S'abonner"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="exercise">Exercice</TabsTrigger>
          <TabsTrigger value="comments">Commentaires</TabsTrigger>
          <TabsTrigger value="chat">Chat Privé</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {lesson.description}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercice de validation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complétez cet exercice pour débloquer la leçon suivante
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Téléchargez votre exercice (audio, vidéo ou image)
                </p>
                <input
                  type="file"
                  accept="audio/*,video/*,image/*"
                  onChange={(e) => setExerciseFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="exercise-upload"
                />
                <label htmlFor="exercise-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Choisir un fichier
                  </Button>
                </label>
                {exerciseFile && (
                  <p className="text-sm mt-2">Fichier: {exerciseFile.name}</p>
                )}
              </div>
              
              <Button className="w-full" disabled={!exerciseFile}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Soumettre l'exercice
              </Button>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                En attente de validation par le professeur
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                  <Button size="sm" disabled={!comment.trim()}>
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
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {comment.likes}
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
              <CardTitle>Professeurs disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableTeachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src="/placeholder.svg" 
                        alt={teacher.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        teacher.status === 'en ligne' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{teacher.name}</h4>
                      <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={teacher.status === 'en ligne' ? 'default' : 'secondary'}>
                      {teacher.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      disabled={teacher.status !== 'en ligne'}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoPlayer;
