import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const learningEvents = sqliteTable('learning_events', {
  userId: text('user_id').notNull(), id: text('id').notNull(), wordId: text('word_id').notNull(),
  kind: text('kind').notNull(), at: integer('at').notNull(), payload: text('payload').notNull(),
}, t => [primaryKey({columns: [t.userId, t.id]})]);
