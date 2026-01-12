import { createContext, useContext, useState, useEffect } from 'react';

type Target = 'khadidja' | 'gacem';

interface TargetContextType {
  target: Target;
  setTarget: (target: Target) => void;
}

const TargetContext = createContext<TargetContextType | undefined>(undefined);

export function TargetProvider({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<Target>('khadidja');

  useEffect(() => {
    // Apply theme class to body
    document.body.classList.remove('theme-khadidja', 'theme-gacem');
    document.body.classList.add(`theme-${target}`);
  }, [target]);

  return (
    <TargetContext.Provider value={{ target, setTarget }}>
      {children}
    </TargetContext.Provider>
  );
}

export function useTarget() {
  const context = useContext(TargetContext);
  if (context === undefined) {
    throw new Error('useTarget must be used within a TargetProvider');
  }
  return context;
}
