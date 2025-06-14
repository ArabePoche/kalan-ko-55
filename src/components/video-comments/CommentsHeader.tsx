
import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommentsHeaderProps {
  loading: boolean;
  commentsCount: number;
  onClose: () => void;
}

export const CommentsHeader: React.FC<CommentsHeaderProps> = ({
  loading,
  commentsCount,
  onClose
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-3xl">
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <span className="text-lg font-semibold">
          {loading ? 'Chargement...' : `${commentsCount} commentaires`}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClose}
        className="rounded-full w-8 h-8 p-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
