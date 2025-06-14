
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessagesProps {
  messages: any[];
  playingVoiceId: string | null;
  onVoicePlay: (messageId: string) => void;
}

const ChatMessages = ({ messages, playingVoiceId, onVoicePlay }: ChatMessagesProps) => (
  <div className="space-y-4">
    {messages.map((msg) => (
      <div key={msg.id} className={`flex ${msg.isStudent ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
        {!msg.isStudent && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={msg.avatar} />
            <AvatarFallback className="bg-[#25d366] text-black">
              {msg.user.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`max-w-xs px-4 py-2 rounded-lg relative ${
          msg.isStudent 
            ? 'bg-[#005c4b] text-white rounded-br-sm' 
            : 'bg-[#202c33] text-white rounded-bl-sm'
        }`}>
          {!msg.isStudent && (
            <p className="text-xs font-medium mb-1 text-[#25d366]">{msg.user}</p>
          )}

          {msg.type === 'voice' ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVoicePlay(msg.id)}
                className="p-1 h-auto text-white hover:bg-white/10"
              >
                {playingVoiceId === msg.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <div className="flex-1 bg-white/20 rounded h-2 relative">
                <div className="bg-[#25d366] h-full rounded w-1/3"></div>
              </div>
              <span className="text-xs">0:03</span>
            </div>
          ) : (
            <p className="text-sm break-words">{msg.message}</p>
          )}

          <p className="text-xs opacity-70 mt-1 text-right">{msg.time}</p>
        </div>

        {msg.isStudent && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={msg.avatar} />
            <AvatarFallback className="bg-[#8696a0] text-white">V</AvatarFallback>
          </Avatar>
        )}
      </div>
    ))}
  </div>
);

export default ChatMessages;
