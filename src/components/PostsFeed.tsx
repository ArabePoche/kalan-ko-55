import { Heart, MessageCircle, Share, MoreHorizontal, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  type: 'recruitment' | 'announcement' | 'general';
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: 'Institut Al-Azhar',
    authorAvatar: '/placeholder.svg',
    timestamp: '2h',
    content: 'Nous recrutons des professeurs qualifiés pour nos nouvelles formations en sciences islamiques. Candidats avec expérience pédagogique privilégiés.',
    type: 'recruitment',
    likes: 45,
    comments: 12
  },
  {
    id: '2',
    author: 'Centre de Formation',
    authorAvatar: '/placeholder.svg',
    timestamp: '5h',
    content: 'Nouvelle formation en langue arabe disponible ! Inscriptions ouvertes jusqu\'au 30 du mois.',
    image: '/placeholder.svg',
    type: 'announcement',
    likes: 89,
    comments: 23
  }
];

const PostsFeed = () => {
  const navigate = useNavigate();

  const handleFeedback = (postId: string) => {
    console.log('Feedback pour le post:', postId);
    navigate('/admin/feedback');
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      <div className="space-y-4 p-4">
        {mockPosts.map((post) => (
          <div key={post.id} className="bg-card rounded-lg border border-border overflow-hidden">
            
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={post.authorAvatar} 
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-foreground">{post.author}</h3>
                  <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-foreground">{post.content}</p>
            </div>

            {/* Post Image */}
            {post.image && (
              <div className="w-full">
                <img 
                  src={post.image} 
                  alt="Post content"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => handleFeedback(post.id)}
                >
                  <Flag className="w-5 h-5" />
                  <span className="text-sm">Feedback</span>
                </button>
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <Share className="w-5 h-5" />
                  <span className="text-sm">Partager</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsFeed;
