import { db } from './client';
import { trips, categories } from './schema';

export async function seedTripsIfEmpty() {
  const existing = await db.select().from(trips);
  if (existing.length > 0) return;

  await db.insert(trips).values([
    { title: 'UK Trip', destination: 'Manchester', startDate: '2026-05-01', endDate: '2026-05-08', notes: '1 week trip to Manchester', categoryId: 1 },
    { title: 'Greece Trip', destination: 'Athens', startDate: '2026-06-01', endDate: '2026-06-08', notes: '1 week trip to Greece', categoryId: 2 },
    { title: 'France Trip', destination: 'Paris', startDate: '2026-07-01', endDate: '2026-07-08', notes: '1 week trip to France', categoryId: 3 },
  ]);
}

export async function seedCategoriesIfEmpty() {
  const existing = await db.select().from(categories);
  if (existing.length > 0) return;

  await db.insert(categories).values([
    { name: 'Flights', colour: '#FF5733', icon: '🛫' },
    { name: 'Accommodation', colour: '#33FF57', icon: '🏡' },
    { name: 'Activities', colour: '#3357FF', icon: '🎯' },
    { name: 'Food', colour: '#FF33A1', icon: '🍽️' },
  ]);
}