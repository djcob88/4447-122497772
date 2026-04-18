import { Stack } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { seedTripsIfEmpty, seedCategoriesIfEmpty, seedActivitiesIfEmpty, seedTargetsIfEmpty } from '@/db/seed';

export type Trip = {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes: string | null;
  categoryId: number;
};

type TripContextType = {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
};

export const TripContext =
  createContext<TripContextType | null>(null);

export default function RootLayout() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const loadTrips = async () => {
      await seedCategoriesIfEmpty();
      await seedTripsIfEmpty();
      await seedActivitiesIfEmpty();
      await seedTargetsIfEmpty();
      const rows = await db.select().from(tripsTable);
      setTrips(rows);
    };

    void loadTrips();
  }, []);

  return (
    <TripContext.Provider value={{ trips, setTrips }}>
      <Stack />
    </TripContext.Provider>
  );
}
