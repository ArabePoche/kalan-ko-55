
import React from "react";
import { X, Mic, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallModalProps {
  open: boolean;
  type: "voice" | "video";
  instructor: { name: string; avatar: string };
  onClose: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ open, type, instructor, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#202c33] rounded-xl shadow-lg p-6 min-w-[290px] flex flex-col items-center max-w-[90vw]">
        <div className="relative mb-5">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-20 h-20 rounded-full border-4 border-[#25d366] mb-2 object-cover"
          />
        </div>
        <div className="text-white text-base font-medium mb-1">
          {instructor.name}
        </div>
        <div className="text-[#8696a0] text-sm mb-4">
          {type === "voice" ? "Appel vocal en cours..." : "Appel vidéo en cours..."}
        </div>
        <div className="flex space-x-6 mb-2">
          <span className="inline-flex items-center justify-center w-10 h-10 bg-[#2a3942] rounded-full text-[#25d366]">
            {type === "voice" ? <Mic className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </span>
        </div>
        <Button
          onClick={onClose}
          className="bg-red-600 hover:bg-red-700 w-12 h-12 p-0 rounded-full mt-3"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default CallModal;
