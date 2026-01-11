import { useState, useEffect } from 'react';
import type { Fact } from '../types';

const STORAGE_KEY = 'khadidja-facts-storage';

export function useFacts() {
  const [facts, setFacts] = useState<Fact[]>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(facts));
  }, [facts]);

  const addFact = (content: string) => {
    const newFact: Fact = {
      id: crypto.randomUUID(),
      content,
      createdAt: Date.now(),
    };
    setFacts((prev) => [newFact, ...prev]);
  };

  const updateFact = (id: string, content: string) => {
    setFacts((prev) =>
      prev.map((fact) =>
        fact.id === id ? { ...fact, content, updatedAt: Date.now() } : fact
      )
    );
  };

  const deleteFact = (id: string) => {
    setFacts((prev) => prev.filter((fact) => fact.id !== id));
  };

  return { facts, addFact, updateFact, deleteFact };
}
