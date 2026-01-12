import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Lock, Heart } from 'lucide-react';

interface LockScreenProps {
  onUnlock: (password: string) => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/.netlify/functions/verify', {
        headers: {
          'X-Api-Password': answer.trim(),
        },
      });

      if (res.ok) {
        onUnlock(answer);
      } else {
        setError(true);
        setAnswer('');
      }
    } catch (err) {
      console.error('Verification failed:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-2 border-dashed border-primary/20 shadow-xl bg-card/50 backdrop-blur-xl animate-in zoom-in-95 duration-300 mt-8">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center ring-1 ring-primary/20 mb-2">
          <Lock className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          Access Verification
        </CardTitle>
        <CardDescription className="text-muted-foreground text-lg">
          What's your nickname suggested by mom?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter answer..."
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError(false);
              }}
              className={`text-center text-lg h-12 transition-all duration-200 ${error
                ? 'border-destructive/50 ring-destructive/20 bg-destructive/5'
                : 'border-primary/20 focus-visible:ring-primary'
                }`}
              autoFocus
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-destructive text-center font-medium animate-in fade-in slide-in-from-top-1">
                Incorrect answer. Hint: It starts with N.
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-lg font-medium bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            {isLoading ? 'Verifying...' : 'Unlock Access'}
          </Button>

          <div className="pt-4 flex justify-center">
            <Heart className="w-4 h-4 text-muted-foreground/30 fill-muted-foreground/10" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
