import { Button } from "@/components/ui/button";
import { Smile, Paperclip, Camera, Send, Mic, MicOff } from "lucide-react";
import { useRef } from "react";

interface ChatInputProps {
  privateMessage: string;
  setPrivateMessage: (val: string) => void;
  isRecording: boolean;
  showEmojiPicker: boolean;
  emojis: string[];
  onToggleEmojiPicker: () => void;
  onSend: () => void;
  onFileAttachment: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVoiceRecord: () => void;
  setIsRecording: (rec: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  // Ajout d'une nouvelle prop pour capturer la photo/vidéo caméra
  onCameraCapture: (event: React.ChangeEvent<HTMLInputElement>) => void;
  cameraInputRef: React.RefObject<HTMLInputElement>;
  onCameraButton: () => void;
}

const ChatInput = ({
  privateMessage,
  setPrivateMessage,
  isRecording,
  showEmojiPicker,
  emojis,
  onToggleEmojiPicker,
  onSend,
  onFileAttachment,
  onFileSelect,
  onVoiceRecord,
  setIsRecording,
  fileInputRef,
  onCameraCapture,
  cameraInputRef,
  onCameraButton,
}: ChatInputProps) => (
  <div className="bg-[#202c33] border-t border-[#313d44] p-4">
    {showEmojiPicker && (
      <div className="mb-4 bg-[#2a3942] border border-[#313d44] rounded-lg p-3">
        <div className="grid grid-cols-6 gap-2">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                setPrivateMessage(privateMessage + emoji);
                onToggleEmojiPicker();
              }}
              className="p-2 hover:bg-[#202c33] rounded text-lg"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    )}

    <div className="flex items-end space-x-2 bg-[#2a3942] rounded-full px-4 py-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onToggleEmojiPicker}
        className="rounded-full p-2 h-auto text-[#8696a0] hover:text-white hover:bg-[#202c33]"
      >
        <Smile className="w-5 h-5" />
      </Button>
      <div className="flex-1">
        <textarea
          placeholder="Tapez votre message..."
          value={privateMessage}
          onChange={(e) => setPrivateMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
          className="w-full resize-none border-none outline-none bg-transparent max-h-20 min-h-6 py-1 text-white placeholder-[#8696a0]"
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
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onFileAttachment}
        className="rounded-full p-2 h-auto text-[#8696a0] hover:text-white hover:bg-[#202c33]"
      >
        <Paperclip className="w-5 h-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onCameraButton}
        className="rounded-full p-2 h-auto text-[#8696a0] hover:text-white hover:bg-[#202c33]"
      >
        <Camera className="w-5 h-5" />
      </Button>
      {privateMessage.trim() ? (
        <Button 
          size="sm" 
          onClick={onSend}
          className="rounded-full p-2 h-auto w-10 bg-[#25d366] hover:bg-[#25d366]/90 text-black"
        >
          <Send className="w-4 h-4" />
        </Button>
      ) : (
        <Button 
          variant={isRecording ? "destructive" : "default"}
          size="sm" 
          onClick={onVoiceRecord}
          className={`rounded-full p-2 h-auto w-10 ${!isRecording ? 'bg-[#25d366] hover:bg-[#25d366]/90 text-black' : ''}`}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
      )}
    </div>
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*,video/*"
      onChange={onFileSelect}
      className="hidden"
    />
  </div>
);

export default ChatInput;
