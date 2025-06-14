
import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthProvider';

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  maxLength?: number;
}

const commonEmojis = [
  '😀', '😁', '😂', '🤣', '😊', '😍', '🥰', '😘', '😉', '😎',
  '🤔', '😮', '😯', '😱', '😭', '😢', '😤', '😡', '🥺', '😴',
  '👍', '👎', '👏', '🙌', '👌', '✌️', '🤞', '🤝', '💪', '🔥',
  '❤️', '💕', '💖', '💯', '✨', '🎉', '🎊', '🚀', '⚡', '💎'
];

export const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Écrivez votre commentaire...",
  maxLength = 500
}) => {
  const { user } = useAuth();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onChange(value + emoji);
    setIsEmojiPickerOpen(false);
  };

  const getInitials = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name.charAt(0).toUpperCase();
    }
    if (user?.user_metadata?.username) {
      return user.user_metadata.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold">
          {getInitials()}
        </span>
      </div>
      <div className="flex-1">
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="min-h-[60px] resize-none border-gray-200 focus:border-primary pr-10"
            maxLength={maxLength}
          />
          <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2" align="end">
              <div className="grid grid-cols-10 gap-1">
                {commonEmojis.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {value.length}/{maxLength}
          </span>
          <Button
            onClick={onSubmit}
            disabled={!value.trim()}
            size="sm"
            className="px-4"
          >
            <Send className="w-4 h-4 mr-1" />
            Publier
          </Button>
        </div>
      </div>
    </div>
  );
};
