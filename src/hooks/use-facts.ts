import { useState, useEffect } from 'react';
import { db } from '../db';
import { facts as factsSchema } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import type { Fact } from '../types';

export function useFacts(target: string) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFacts = async () => {
      setIsLoading(true);
      try {
        const result = await db
          .select()
          .from(factsSchema)
          .where(eq(factsSchema.target, target))
          .orderBy(desc(factsSchema.createdAt));
        setFacts(result);
      } catch (error) {
        console.error('Failed to load facts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFacts();
  }, [target]);

  const addFact = async (content: string, tags: string[] = []) => {
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

      const [newFact] = await db.insert(factsSchema).values({
        content,
        ipAddress,
        userAgent,
        location,
        tags,
        target,
      }).returning();

      setFacts((prev) => [newFact, ...prev]);
    } catch (error) {
      console.error('Failed to add fact:', error);
    }
  };

  const updateFact = async (id: string, content: string, tags: string[]) => {
    try {
      const [updatedFact] = await db
        .update(factsSchema)
        .set({ content, tags, updatedAt: new Date() })
        .where(eq(factsSchema.id, id))
        .returning();

      setFacts((prev) =>
        prev.map((fact) => (fact.id === id ? updatedFact : fact))
      );
    } catch (error) {
      console.error('Failed to update fact:', error);
    }
  };

  const deleteFact = async (id: string) => {
    try {
      await db.delete(factsSchema).where(eq(factsSchema.id, id));
      setFacts((prev) => prev.filter((fact) => fact.id !== id));
    } catch (error) {
      console.error('Failed to delete fact:', error);
    }
  };

  return { facts, addFact, updateFact, deleteFact, isLoading };
}
