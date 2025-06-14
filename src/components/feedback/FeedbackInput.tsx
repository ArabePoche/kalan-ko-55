
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

interface FeedbackInputProps {
  onSubmit: (submitterName: string, comment: string) => void;
  isSubmitting: boolean;
}

export const FeedbackInput = ({ onSubmit, isSubmitting }: FeedbackInputProps) => {
  const [submitterName, setSubmitterName] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!submitterName.trim() || !comment.trim()) return;
    onSubmit(submitterName, comment);
    setSubmitterName('');
    setComment('');
  };

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="w-8 h-8 mt-1">
            <AvatarFallback className="text-xs bg-blue-100">
              {submitterName ? submitterName[0].toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Input
              placeholder="Votre nom"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              className="bg-white"
            />
            <Textarea
              placeholder="Ajoutez votre feedback sur cette vidéo..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-white min-h-[80px] resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !submitterName.trim() || !comment.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
