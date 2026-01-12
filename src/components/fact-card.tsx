import { useState } from 'react';
import type { Fact } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Pencil, Trash2, Check, X, Calendar, Heart } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming this exists from shadcn init

import { TAG_OPTIONS } from '../constants';

interface FactCardProps {
  fact: Fact;
  onUpdate: (id: string, content: string, tags: string[]) => void;
  onDelete: (id: string) => void;
  index: number;
}

export function FactCard({ fact, onUpdate, onDelete, index }: FactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedContent, setEditedContent] = useState(fact.content);
  const [editedTag, setEditedTag] = useState<string>(fact.tags?.[0] || TAG_OPTIONS[0]);

  const handleSave = () => {
    if (editedContent.trim()) {
      onUpdate(fact.id, editedContent, [editedTag]);
      setIsEditing(false);
    }
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(fact.createdAt));

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-primary/10 glass-card animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards",
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <span className="text-6xl font-black text-primary font-mono select-none">#{index + 1}</span>
      </div>

      <CardHeader className="pb-2 flex flex-row items-center justify-between z-10 relative">
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
          {!isEditing && fact.tags && fact.tags.length > 0 && (
            <>
              <span className="mx-1">•</span>
              <div className="flex gap-1">
                {fact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors border-transparent ring-1 ring-primary/20 bg-primary/5 text-primary capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        {!isEditing && !isDeleting && (
          <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => {
                setIsEditing(true);
                setEditedContent(fact.content);
                setEditedTag(fact.tags?.[0] || TAG_OPTIONS[0]);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => setIsDeleting(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
        {isDeleting && (
          <div className="flex gap-2 items-center animate-in fade-in slide-in-from-right-4 duration-200">
            <span className="text-xs text-destructive font-medium">Delete?</span>
            <Button
              size="sm"
              variant="destructive"
              className="h-7 px-2 text-xs"
              onClick={() => onDelete(fact.id)}
            >
              Yes
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs"
              onClick={() => setIsDeleting(false)}
            >
              No
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-6">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] bg-background/50 backdrop-blur-sm resize-none focus-visible:ring-primary"
            />

            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={editedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditedTag(tag)}
                  className={`capitalize text-xs h-7 ${editedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-transparent border-primary/20 hover:bg-primary/10'}`}
                >
                  {tag}
                </Button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Check className="w-4 h-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Heart className="absolute -left-1 -top-1 w-4 h-4 text-primary/10 -rotate-12" />
            <p className="text-lg font-medium leading-relaxed pl-2 text-foreground/90">
              {fact.content}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
