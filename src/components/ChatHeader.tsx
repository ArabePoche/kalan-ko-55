
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatHeaderProps {
  lessonTitle: string;
  lessonDuration: string;
  instructor: { name: string; avatar: string };
  onCall: (type: 'voice' | 'video') => void;
}

const ChatHeader = ({ lessonTitle, lessonDuration, instructor, onCall }: ChatHeaderProps) => (
  <div className="bg-[#202c33] border-b border-[#313d44] p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={instructor.avatar} />
          <AvatarFallback className="bg-[#25d366] text-black">
            {instructor.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-white">{lessonTitle}</h3>
          <p className="text-sm text-[#8696a0]">
            {instructor.name} • {lessonDuration}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onCall('voice')}
          className="text-[#8696a0] hover:text-white hover:bg-[#2a3942] rounded-full"
        >
          <Phone className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onCall('video')}
          className="text-[#8696a0] hover:text-white hover:bg-[#2a3942] rounded-full"
        >
          <Video className="w-5 h-5" />
        </Button>
      </div>
    </div>
  </div>
);

export default ChatHeader;
