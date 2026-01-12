import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Sparkles, Plus } from 'lucide-react';
import { FrogObject } from '@/frog-obj/frog-object';

interface AddFactFormProps {
  onAdd: (content: string) => void;
}

export function AddFactForm({ onAdd }: AddFactFormProps) {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content);
      setContent('');
      setIsExpanded(false);
    }
  };

  return (
    <Card className="relative border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors mb-8 shadow-sm">
      <CardContent className="p-4">
        {!isExpanded ? (
          <Button
            variant="ghost"
            className="w-full h-12 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Add a new fun fact about Khadidja...</span>
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-top-2">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-primary mt-3 flex-shrink-0 animate-pulse" />
              <Textarea
                placeholder="What's the fun fact?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] border-primary/20 focus-visible:ring-primary bg-background/80"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsExpanded(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!content.trim()} className="bg-primary hover:bg-primary/20 cursor-pointer">
                Add Fact
              </Button>
            </div>
          </form>
        )}

        <div className='absolute -bottom-5 left-0'>
          <FrogObject />
        </div>
      </CardContent>
    </Card>
  );
}
