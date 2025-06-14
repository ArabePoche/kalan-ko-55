
import { Button } from "@/components/ui/button";
import { Play, ChevronUp, ChevronDown } from "lucide-react";

interface VideoSectionProps {
  visible: boolean;
  onToggle: () => void;
  lessonTitle: string;
  lessonDuration: string;
}

const VideoSection = ({ visible, onToggle, lessonTitle, lessonDuration }: VideoSectionProps) => (
  <>
    {visible ? (
      <div className="bg-black border-b border-[#313d44]">
        <div className="aspect-video flex items-center justify-center relative">
          <div className="text-center text-white">
            <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
            <p className="text-lg font-medium">{lessonTitle}</p>
            <p className="text-sm opacity-70">Durée: {lessonDuration}</p>
          </div>
          <Button
            onClick={onToggle}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            size="sm"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ) : (
      <div className="bg-[#202c33] border-b border-[#313d44] p-2">
        <Button
          onClick={onToggle}
          variant="ghost"
          className="w-full text-[#8696a0] hover:text-white hover:bg-[#2a3942] justify-start"
        >
          <ChevronDown className="w-4 h-4 mr-2" />
          Afficher la vidéo
        </Button>
      </div>
    )}
  </>
);

export default VideoSection;
