import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Sparkles, Plus } from 'lucide-react';
import { FrogObject } from '@/frog-obj/frog-object';
import { ModeToggle } from './mode-toggle';
import { TAG_OPTIONS } from '../constants';

interface AddFactFormProps {
  onAdd: (content: string, tags: string[]) => void;
}

export function AddFactForm({ onAdd }: AddFactFormProps) {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>(TAG_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content, [selectedTag]);
      setContent('');
      setSelectedTag(TAG_OPTIONS[0]);
      setIsExpanded(false);
    }
  };

  return (
    <Card className="relative border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors mb-8 shadow-sm">
      <CardContent className="p-4">
        {!isExpanded ? (
          <div className='flex items-center gap-4'>
            <Button
              variant="ghost"
              className="flex-1 h-12 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary cursor-pointer"
              onClick={() => setIsExpanded(true)}
            >
              <Plus className="w-5 h-5" />
              <span>Add a new fun fact about Khadidja...</span>
            </Button>
            <div className="">
              <ModeToggle />
            </div>
          </div>
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

            <div className="flex flex-wrap gap-2 pl-7">
              {TAG_OPTIONS.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className={`capitalize text-xs h-7 ${selectedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-transparent border-primary/20 hover:bg-primary/10'}`}
                >
                  {tag}
                </Button>
              ))}
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
