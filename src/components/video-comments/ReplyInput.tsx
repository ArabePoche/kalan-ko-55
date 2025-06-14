
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ReplyInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  maxLength?: number;
}

export const ReplyInput: React.FC<ReplyInputProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  maxLength = 500
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="ml-11 mt-3">
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-primary">V</span>
        </div>
        <div className="flex-1">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Écrivez votre réponse..."
            className="min-h-[50px] resize-none border-gray-200 focus:border-primary text-sm"
            maxLength={maxLength}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {value.length}/{maxLength}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="text-xs"
              >
                Annuler
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!value.trim()}
                size="sm"
                className="text-xs px-3"
              >
                <Send className="w-3 h-3 mr-1" />
                Répondre
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
