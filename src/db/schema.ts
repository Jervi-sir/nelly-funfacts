import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const facts = pgTable('facts', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export type Fact = typeof facts.$inferSelect;
export type NewFact = typeof facts.$inferInsert;
