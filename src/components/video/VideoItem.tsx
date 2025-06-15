
import React, { useRef, useState, useEffect, forwardRef } from "react";
import { PlayCircle, List, Search, ShoppingCart, Heart, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video } from "@/types/video";
import { useNavigate } from "react-router-dom";
import { getEmbedUrl } from "@/utils/videoUtils";

// Mapping pour les badges de catégorie/vidéo type
const VIDEO_TYPE_LABELS: { [key: string]: string } = {
  promo: "Promotionnel",
  educational: "Éducatif",
  testimonial: "Témoignage",
};
const VIDEO_TYPE_COLORS: { [key: string]: string } = {
  promo: "bg-blue-600",
  educational: "bg-green-600",
  testimonial: "bg-purple-600",
};

interface VideoItemProps {
  video: Video;
  index: number;
  currentVideoIndex: number;
  iframeRef: (el: HTMLIFrameElement | null) => void;
  onLike: (videoId: string) => void;
  onComment: (videoId: string) => void;
  onShare: (videoId: string) => void;
  onBuyClick: (video: Video) => void;
  onViewCountIncrement: (videoId: string) => void;
}

const VideoItem = forwardRef<HTMLDivElement, VideoItemProps>(({
  video,
  index,
  currentVideoIndex,
  iframeRef,
  onLike,
  onComment,
  onShare,
  onBuyClick,
  onViewCountIncrement,
}, ref) => {
  const [isPaused, setIsPaused] = useState(true);
  const [activeTab, setActiveTab] = useState<"videos" | "posts" | "search">("videos");
  const videoContainer = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Appelé pour jouer la vidéo quand visible, pause sinon (style TikTok)
  useEffect(() => {
    if (index === currentVideoIndex) {
      setIsPaused(false);
      onViewCountIncrement(video.id);
    } else {
      setIsPaused(true);
    }
  }, [index, currentVideoIndex, video.id, onViewCountIncrement]);

  // Overlay dégradé pour lisibilité
  const OverlayGradient = () => (
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none"/>
  );

  // Avatar instructeur
  const renderInstructorAvatar = () => (
    video.author?.username ?
      <img
        src={video.author.avatar_url || "/placeholder.svg"}
        alt={video.author.username}
        className="w-8 h-8 rounded-full border-2 border-white"
      />
      : null
  );

  // Onglets transparents sur la vidéo
  const renderTabs = () => (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex space-x-1 bg-black/30 backdrop-blur rounded-full px-2 py-1">
      <button
        className={`flex items-center px-2 py-1 rounded-full font-medium text-white text-sm transition-all
         ${activeTab === "videos" ? "bg-white/20" : "opacity-70 hover:bg-white/10"}`}
        onClick={() => setActiveTab("videos")}
        aria-label="Vidéos"
      >
        <PlayCircle className="w-5 h-5 mr-1" /> Vidéos
      </button>
      <button
        className={`flex items-center px-2 py-1 rounded-full font-medium text-white text-sm transition-all
         ${activeTab === "posts" ? "bg-white/20" : "opacity-70 hover:bg-white/10"}`}
        onClick={() => setActiveTab("posts")}
        aria-label="Posts"
      >
        <List className="w-5 h-5 mr-1" /> Posts
      </button>
      <button
        className={`flex items-center px-2 py-1 rounded-full font-medium text-white text-sm transition-all
         ${activeTab === "search" ? "bg-white/20" : "opacity-70 hover:bg-white/10"}`}
        onClick={() => { setActiveTab("search"); navigate("/search"); }}
        aria-label="Recherche"
      >
        <Search className="w-5 h-5 mr-1" /> Recherche
      </button>
    </div>
  );

  const handleVideoClick = () => setIsPaused(!isPaused);

  // VIEW
  return (
    <div
      ref={ref}
      className="video-snap-item w-full h-screen bg-black relative overflow-hidden flex items-center justify-center snap-start"
      style={{ scrollSnapAlign: "start" }}
      tabIndex={0}
      aria-label={`Vidéo ${video.title}`}
    >
      {/* Dégradé et tabs en top */}
      <OverlayGradient />
      {renderTabs()}

      {/* Badge catégorie/type */}
      {video.video_type && (
        <div className="absolute top-20 left-4 z-30">
          <Badge className={`text-white ${VIDEO_TYPE_COLORS[video.video_type] || "bg-gray-700"}`}>
            {VIDEO_TYPE_LABELS[video.video_type] || video.video_type}
          </Badge>
        </div>
      )}

      {/* Affichage principal selon l’onglet */}
      {activeTab === "videos" ? (
        <div className="absolute inset-0 w-full h-full cursor-pointer" onClick={handleVideoClick}>
          {/* Vidéo embed (YouTube, Vimeo, ...) */}
          {getEmbedUrl(video.video_url) ? (
            <iframe
              ref={iframeRef}
              src={getEmbedUrl(video.video_url)}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <p className="text-white text-lg">Vidéo non disponible</p>
            </div>
          )}

          {/* Superposition Play/Pause */}
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <PlayCircle className="w-10 h-10 text-black ml-1" />
                </div>
              </div>
            </div>
          )}

          {/* Footer: infos, titre, achat, instructeur */}
          <div className="absolute bottom-24 left-4 right-24 flex flex-col z-30">
            <div className="flex items-center gap-2 mb-2">
              {video.author?.avatar_url && (
                <img
                  src={video.author.avatar_url}
                  alt={video.author.username}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              )}
              <span className="text-white text-sm font-semibold">{video.author?.first_name} {video.author?.last_name}</span>
            </div>
            {/* Titre & desc */}
            <h3 className="text-white text-lg font-bold mb-1 line-clamp-2">{video.title}</h3>
            {video.description && (
              <p className="text-white/80 text-sm line-clamp-2 mb-2">{video.description}</p>
            )}
            {/* Achat si produit */}
            {video.product && (
              <Button
                onClick={() => onBuyClick(video)}
                className="mt-2 w-max flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
              >
                <ShoppingCart className="w-5 h-5" />
                Acheter - {video.product.price}€
              </Button>
            )}
            {/* Stats */}
            <div className="flex items-center space-x-4 text-white text-xs mt-3">
              <span>{video.views_count || 0} vues</span>
              <span>{video.likes_count || 0} j'aime</span>
              <span>{video.comments_count || 0} com.</span>
            </div>
          </div>

          {/* Actions type TikTok à droite */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center space-y-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onLike(video.id)}
              className="text-white hover:bg-white/20 rounded-full p-3 transition"
              aria-label={video.isLiked ? "Retirer le J'aime" : "Aimer"}
            >
              <Heart className={`w-7 h-7 ${video.isLiked ? "text-red-500 fill-red-500" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onComment(video.id)}
              className="text-white hover:bg-white/20 rounded-full p-3 transition"
              aria-label="Commenter"
            >
              <MessageCircle className="w-7 h-7" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShare(video.id)}
              className="text-white hover:bg-white/20 rounded-full p-3 transition"
              aria-label="Partager"
            >
              <Share2 className="w-7 h-7" />
            </Button>
          </div>
        </div>
      ) : activeTab === "posts" ? (
        <div className="w-full h-full flex justify-center items-center text-white bg-black bg-opacity-80 z-40">
          {/* Placeholder, doit être remplacé par le composant de feed de posts */}
          <span>Feed des posts à venir...</span>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-white bg-black bg-opacity-80 z-40">
          <span>Recherche de vidéos...</span>
        </div>
      )}
    </div>
  );
});
VideoItem.displayName = "VideoItem";

export default VideoItem;
