import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const trips = sqliteTable('trips', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  destination: text('destination').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  notes: text('notes'),
  categoryId: integer('category_id').notNull()
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  colour: text('colour').notNull(),
  icon: text('icon').notNull()
}); 

export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').notNull(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  notes: text('notes'),
  categoryId: integer('category_id').notNull()
});

export const targets = sqliteTable('targets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  timePeriod: text('time_period').notNull(),
  targetMinutes: integer('target_minutes').notNull()
});