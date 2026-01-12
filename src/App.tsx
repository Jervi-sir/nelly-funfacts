import { useState } from 'react';
import { useFacts } from './hooks/use-facts';
import { AddFactForm } from './components/add-fact-form';
import { FactCard } from './components/fact-card';
import { LockScreen } from './components/lock-screen';
import { Heart } from 'lucide-react';
import { ThemeProvider } from './components/theme-provider';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { facts, addFact, updateFact, deleteFact, isLoading } = useFacts();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen pb-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-2xl space-y-8 pt-12">

          {/* Header */}
          <div className="text-center space-y-2 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 ring-1 ring-primary/20 backdrop-blur-sm">
              <Heart className="w-8 h-8 text-primary fill-primary/20 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground/90 drop-shadow-sm">
              Khadidja's <span className="text-primary italic">Fun Facts</span>
            </h1>
            <p className="text-lg text-muted-foreground/80 font-medium">
              A collection of things that make her special
            </p>
          </div>

          {!isAuthenticated ? (
            <LockScreen onUnlock={() => setIsAuthenticated(true)} />
          ) : (
            <>
              {/* Add Form */}
              <AddFactForm onAdd={addFact} />

              {/* List */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="text-muted-foreground mt-4">Loading facts...</p>
                  </div>
                ) : facts.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-xl border border-dashed border-muted-foreground/20 bg-muted/30">
                    <p className="text-muted-foreground">No facts yet! Start adding some fun facts about Khadidja.</p>
                  </div>
                ) : (
                  facts.map((fact, index) => (
                    <FactCard
                      key={fact.id}
                      index={index}
                      fact={fact}
                      onUpdate={updateFact}
                      onDelete={deleteFact}
                    />
                  ))
                )}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center py-8 text-sm text-muted-foreground/50">
            Made with ❤️ for Khadidja
          </div>
        </div>
      </div>
    </ThemeProvider>

  );
}

export default App;
