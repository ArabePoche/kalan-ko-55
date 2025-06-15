
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import VideoEditModal from "./VideoEditModal";

interface VideosListProps {
  videos: any[];
  loading?: boolean;
  error?: Error | null;
  onUpdated?: () => void;
}

const VideosList = ({ videos, loading, error, onUpdated }: VideosListProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<any>(null);

  if (loading) {
    return <p>Chargement des vidéos...</p>;
  }
  
  if (error) {
    return <p className="text-destructive">Erreur: {error.message}</p>;
  }
  
  if (!videos || videos.length === 0) {
    return <p>Aucune vidéo n'a été trouvée.</p>;
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'promo': return 'Promotionnel';
      case 'educational': return 'Éducatif';
      case 'testimonial': return 'Témoignage';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'promo': return 'bg-green-500';
      case 'educational': return 'bg-blue-500';
      case 'testimonial': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div key={video.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-medium">{video.title || "Sans titre"}</h3>
                <Badge className={`text-white ${getTypeColor(video.video_type)}`}>
                  {getTypeLabel(video.video_type)}
                </Badge>
              </div>
              
              {video.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {video.description}
                </p>
              )}

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views_count || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{video.likes_count || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{video.comments_count || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {video.video_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(video.video_url, '_blank')}
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setVideoToEdit(video);
                  setEditOpen(true);
                }}
              >
                Modifier
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      <VideoEditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        video={videoToEdit}
        onUpdated={() => {
          setEditOpen(false);
          setVideoToEdit(null);
          onUpdated && onUpdated();
        }}
      />
    </div>
  );
};

export default VideosList;
