
import { Button } from "@/components/ui/button";
import { Play, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

interface VideoSectionProps {
  visible: boolean;
  onToggle: () => void;
  lessonTitle: string;
  lessonDuration: string;
}

const VideoSection = ({ visible, onToggle, lessonTitle, lessonDuration }: VideoSectionProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`bg-black border-b border-[#313d44] transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50' : 'relative'
    }`}>
      <div className={`${isFullscreen ? 'h-full' : 'aspect-video'} flex items-center justify-center relative`}>
        {/* Contenu de la vidéo */}
        <div className="text-center text-white">
          <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
          <p className="text-lg font-medium">{lessonTitle}</p>
          <p className="text-sm opacity-70">Durée: {lessonDuration}</p>
        </div>
        
        {/* Contrôles vidéo */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button
            onClick={toggleFullscreen}
            className="bg-black/50 hover:bg-black/70 text-white"
            size="sm"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Bouton de fermeture pour le mode plein écran */}
        {isFullscreen && (
          <Button
            onClick={toggleFullscreen}
            className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white"
            size="sm"
          >
            ← Retour au chat
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoSection;
