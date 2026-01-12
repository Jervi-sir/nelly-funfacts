import { useState, useEffect } from 'react';
import type { Fact } from '../types';

export function useFacts(target: string, password?: string) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!password) {
      setIsLoading(false);
      return;
    }

    const loadFacts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/facts?target=${target}`, {
          headers: {
            'X-Api-Password': password,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Ensure dates are parsed correctly if needed, though JSON returns strings
        const parsedData = data.map((f: Fact) => ({
          ...f,
          createdAt: new Date(f.createdAt),
          updatedAt: f.updatedAt ? new Date(f.updatedAt) : null,
        }));
        setFacts(parsedData);
      } catch (error) {
        console.error('Failed to load facts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacts();
  }, [target, password]);

  const addFact = async (content: string, tags: string[] = []) => {
    if (!password) return;

    try {
      // Gather tracking info
      let ipAddress: string | null = null;
      let location: string | null = null;
      const userAgent = navigator.userAgent;

      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          ipAddress = data.ip;
          location = [data.city, data.region, data.country_name].filter(Boolean).join(', ');
        }
      } catch (e) {
        console.warn('Failed to fetch tracking info:', e);
      }

      const res = await fetch('/.netlify/functions/facts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Password': password,
        },
        body: JSON.stringify({
          content,
          ipAddress,
          userAgent,
          location,
          tags,
          target,
        }),
      });

      if (!res.ok) throw new Error('Failed to create fact');
      const newFact = await res.json();

      setFacts((prev) => [{
        ...newFact,
        createdAt: new Date(newFact.createdAt),
        updatedAt: newFact.updatedAt ? new Date(newFact.updatedAt) : null
      }, ...prev]);
    } catch (error) {
      console.error('Failed to add fact:', error);
    }
  };

  const updateFact = async (id: string, content: string, tags: string[]) => {
    if (!password) return;

    try {
      const res = await fetch('/.netlify/functions/facts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Password': password,
        },
        body: JSON.stringify({ id, content, tags }),
      });

      if (!res.ok) throw new Error('Failed to update fact');
      const updatedFact = await res.json();

      setFacts((prev) =>
        prev.map((fact) => (fact.id === id ? {
          ...updatedFact,
          createdAt: new Date(updatedFact.createdAt),
          updatedAt: updatedFact.updatedAt ? new Date(updatedFact.updatedAt) : null
        } : fact))
      );
    } catch (error) {
      console.error('Failed to update fact:', error);
    }
  };

  const deleteFact = async (id: string) => {
    if (!password) return;

    try {
      const res = await fetch(`/.netlify/functions/facts?id=${id}`, {
        method: 'DELETE',
        headers: {
          'X-Api-Password': password,
        },
      });

      if (!res.ok) throw new Error('Failed to delete fact');

      setFacts((prev) => prev.filter((fact) => fact.id !== id));
    } catch (error) {
      console.error('Failed to delete fact:', error);
    }
  };

  return { facts, addFact, updateFact, deleteFact, isLoading };
}
