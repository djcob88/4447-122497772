import { db } from './client';
import { trips, categories, activities, targets } from './schema';

export async function seedTripsIfEmpty() {
  const existing = await db.select().from(trips);
  if (existing.length > 0) return;

  await db.insert(trips).values([
    { title: 'UK Trip', destination: 'Manchester', startDate: '2026-05-01', endDate: '2026-05-08', notes: '1 week trip to Manchester', categoryId: 1 },
    { title: 'Greece Trip', destination: 'Athens', startDate: '2026-06-01', endDate: '2026-06-08', notes: '1 week trip to Greece', categoryId: 2 },
    { title: 'France Trip', destination: 'Paris', startDate: '2026-07-01', endDate: '2026-07-08', notes: '1 week trip to France', categoryId: 3 }
  ]);
}

export async function seedCategoriesIfEmpty() {
  const existing = await db.select().from(categories);
  if (existing.length > 0) return;

  await db.insert(categories).values([
    { name: 'Flights', colour: '#FF5733', icon: '🛫' },
    { name: 'Accommodation', colour: '#33FF57', icon: '🏡' },
    { name: 'Activities', colour: '#3357FF', icon: '🎯' },
    { name: 'Food', colour: '#FF33A1', icon: '🍽️' }
  ]);
}

export async function seedActivitiesIfEmpty() {
  const existing = await db.select().from(activities);
  if (existing.length > 0) return;

  await db.insert(activities).values([
    { tripId: 1, title: 'Visit Old Trafford', date: '2026-05-02', durationMinutes: 120, notes: 'Watch a football match', categoryId: 3 },
    { tripId: 1, title: 'Go to the Grand Pacific', date: '2026-05-03', durationMinutes: 90, notes: 'Get dinner at the Grand Pacific', categoryId: 4 },
    { tripId: 2, title: 'Visit Acropolis', date: '2026-06-02', durationMinutes: 180, notes: 'Guided tour of Acropolis', categoryId: 3 },
    { tripId: 2, title: 'Go to Spondi', date: '2026-06-03', durationMinutes: 90, notes: 'Get dinner at Spondi', categoryId: 4 },
    { tripId: 3, title: 'Visit Eiffel Tower', date: '2026-07-02', durationMinutes: 120, notes: 'Visit the Eiffel Tower', categoryId: 3 },
    { tripId: 3, title: 'Go to Le Jules Verne', date: '2026-07-03', durationMinutes: 90, notes: 'Get dinner at Le Jules Verne', categoryId: 4 }
  ]);
}

export async function seedTargetsIfEmpty() {
  const existing = await db.select().from(targets);
  if (existing.length > 0) return;

  await db.insert(targets).values([
    { timePeriod: 'weekly', targetMinutes: 300},
    {timePeriod: 'monthly', targetMinutes: 1200}
  ]);
}