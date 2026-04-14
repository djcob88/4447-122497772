import { db } from './client';
import { trips } from './schema';

export async function seedTripsIfEmpty() {
  const existing = await db.select().from(trips);
  if (existing.length > 0) return;

  await db.insert(trips).values([
    { title: 'UK Trip', destination: 'Manchester', startDate: '2026-05-01', endDate: '2026-05-08', notes: '1 week trip to Manchester' },
    { title: 'Greece Trip', destination: 'Athens', startDate: '2026-06-01', endDate: '2026-06-08', notes: '1 week trip to Greece' },
    { title: 'France Trip', destination: 'Paris', startDate: '2026-07-01', endDate: '2026-07-08', notes: '1 week trip to France' },
  ]);
}