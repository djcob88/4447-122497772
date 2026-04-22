import { db } from './client';
import { trips, categories, activities, targets } from './schema';

export async function seedTripsIfEmpty() {
  const existing = await db.select().from(trips);
  if (existing.length > 0) return;

  await db.insert(trips).values([
    {title: 'Italy Trip', destination: 'Rome', startDate: '2026-04-24', endDate: '2026-04-30', notes: 'Trip to Rome'},
    {title: 'UK Trip', destination: 'Manchester', startDate: '2026-05-01', endDate: '2026-05-07', notes: 'Trip to Manchester'},
    {title: 'Spain Trip', destination: 'Barcelona', startDate: '2026-05-08', endDate: '2026-05-15', notes: 'Trip to Barcelona'},
    {title: 'Portugal Trip', destination: 'Lisbon', startDate: '2026-05-16', endDate: '2026-05-23', notes: 'Trip to Lisbon'},
    {title: 'Greece Trip', destination: 'Athens', startDate: '2026-06-01', endDate: '2026-06-07', notes: 'Trip to Greece'}
  ]);
}

export async function seedCategoriesIfEmpty() {
  const existing = await db.select().from(categories);
  if (existing.length > 0) return;

  await db.insert(categories).values([
    { name: 'Sightseeing', colour: '#FF5733', icon: '🔭' },
    { name: 'Outdoors', colour: '#33FF57', icon: '🏞️' },
    { name: 'Entertainment', colour: '#3357FF', icon: '🎯' },
    { name: 'Food', colour: '#FF33A1', icon: '🍽️' },
    { name: 'Relaxation', colour: '#e7ff0f', icon: '🏖️' }
  ]);
}

export async function seedActivitiesIfEmpty() {
  const existing = await db.select().from(activities);
  if (existing.length > 0) return;

  await db.insert(activities).values([
    { tripId: 1, title: 'City Landmarks', date: '2026-04-25', durationMinutes: 120, notes: 'Main sights in the city centre', categoryId: 1 },
    { tripId: 1, title: 'Park Walk', date: '2026-04-26', durationMinutes: 90, notes: 'Walk through the local park', categoryId: 2 },
    { tripId: 1, title: 'Live Music', date: '2026-04-27', durationMinutes: 80, notes: 'Evening entertainment', categoryId: 3 },
    { tripId: 1, title: 'Dinner Out', date: '2026-04-27', durationMinutes: 70, notes: 'Restaurant in the city', categoryId: 4 },
    { tripId: 1, title: 'Beach Chill', date: '2026-04-28', durationMinutes: 100, notes: 'Relaxing by the beach', categoryId: 5 },
    { tripId: 2, title: 'Museum Visit', date: '2026-05-02', durationMinutes: 110, notes: 'Local history museum', categoryId: 1 },
    { tripId: 2, title: 'Hiking Trail', date: '2026-05-03', durationMinutes: 150, notes: 'Morning trail walk', categoryId: 2 },
    { tripId: 2, title: 'Cinema Night', date: '2026-05-04', durationMinutes: 120, notes: 'Evening film', categoryId: 3 },
    { tripId: 2, title: 'Street Food', date: '2026-05-05', durationMinutes: 60, notes: 'Tried local food stalls', categoryId: 4 },
    { tripId: 3, title: 'Historic Tour', date: '2026-05-10', durationMinutes: 130, notes: 'Guided city tour', categoryId: 1 },
    { tripId: 3, title: 'Nature Walk', date: '2026-05-11', durationMinutes: 100, notes: 'Scenic outdoor route', categoryId: 2 },
    { tripId: 3, title: 'Theme Park', date: '2026-05-12', durationMinutes: 180, notes: 'Full afternoon visit', categoryId: 3 },
    { tripId: 3, title: 'Lunch Spot', date: '2026-05-13', durationMinutes: 75, notes: 'Popular local cafe', categoryId: 4 },
    { tripId: 3, title: 'Spa Day', date: '2026-05-14', durationMinutes: 140, notes: 'Relaxation session', categoryId: 5 },
    { tripId: 4, title: 'Castle Visit', date: '2026-05-20', durationMinutes: 100, notes: 'Afternoon sightseeing', categoryId: 1 },
    { tripId: 4, title: 'Cycling', date: '2026-05-21', durationMinutes: 120, notes: 'Outdoor cycle route', categoryId: 2 },
    { tripId: 4, title: 'Concert', date: '2026-05-22', durationMinutes: 150, notes: 'Evening music event', categoryId: 3 },
    { tripId: 4, title: 'Dinner Date', date: '2026-05-23', durationMinutes: 90, notes: 'Restaurant booking', categoryId: 4 },
    { tripId: 5, title: 'Sightseeing Tour', date: '2026-06-02', durationMinutes: 140, notes: 'Landmark bus tour', categoryId: 1 },
    { tripId: 5, title: 'Forest Walk', date: '2026-06-03', durationMinutes: 110, notes: 'Morning outdoor walk', categoryId: 2 },
    { tripId: 5, title: 'Festival', date: '2026-06-04', durationMinutes: 160, notes: 'Live event in town', categoryId: 3 },
    { tripId: 5, title: 'Brunch', date: '2026-06-05', durationMinutes: 70, notes: 'Late morning meal', categoryId: 4 },
    { tripId: 5, title: 'Beach Day', date: '2026-06-06', durationMinutes: 150, notes: 'Relaxing all afternoon', categoryId: 5 }
  ]);
}

export async function seedTargetsIfEmpty() {
  const existing = await db.select().from(targets);
  if (existing.length > 0) return;

  await db.insert(targets).values([
    { timePeriod: 'weekly', targetMinutes: 300, categoryId: 1 },
    { timePeriod: 'monthly', targetMinutes: 900, categoryId: 1 },
    { timePeriod: 'weekly', targetMinutes: 250, categoryId: 2 },
    { timePeriod: 'monthly', targetMinutes: 800, categoryId: 2 },
    { timePeriod: 'weekly', targetMinutes: 200, categoryId: 3 },
    { timePeriod: 'monthly', targetMinutes: 700, categoryId: 3 },
    { timePeriod: 'weekly', targetMinutes: 150, categoryId: 4 },
    { timePeriod: 'monthly', targetMinutes: 600, categoryId: 4 },
    { timePeriod: 'weekly', targetMinutes: 180, categoryId: 5 },
    { timePeriod: 'monthly', targetMinutes: 650, categoryId: 5 },
  ]);
}