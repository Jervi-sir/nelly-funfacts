import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { User } from 'lucide-react';
import { useTarget } from './target-provider';

export const SelectTarget = () => {
  const { setTarget } = useTarget();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Change Target</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTarget('khadidja')}>
            Khadidja
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTarget('gacem')}>
            Gacem
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};