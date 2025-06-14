
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  maxLength?: number;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Écrivez votre commentaire...",
  maxLength = 500
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary">V</span>
      </div>
      <div className="flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="min-h-[60px] resize-none border-gray-200 focus:border-primary"
          maxLength={maxLength}
        />
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
