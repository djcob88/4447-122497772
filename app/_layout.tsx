import { Stack, useSegments, useRouter, useRootNavigationState } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { seedTripsIfEmpty, seedCategoriesIfEmpty, seedActivitiesIfEmpty, seedTargetsIfEmpty } from '@/db/seed';
import { AuthProvider, useAuth } from '@/context/authcontext';

export type Trip = {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes: string | null;
};

type TripContextType = {trips: Trip[]; setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;};

export const TripContext =createContext<TripContextType | null>(null);

function AppContent() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [mounted, setMounted] = useState(false);
  const {user} = useAuth(); 
  const router = useRouter(); 
  const segments = useSegments(); 
  const rootNavigationState = useRootNavigationState();
  useEffect(() => {setMounted(true);}, []);

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

useEffect(() => {
  if (!mounted) return;
  if (!rootNavigationState?.key) return;
  const inAuthGroup =
    segments[0] === 'login' || segments[0] === 'register';
    if (!user && !inAuthGroup) {router.replace('/login');}
    if (user && inAuthGroup) {router.replace('/');}
  }, [mounted, user, segments, router, rootNavigationState]);

  return (
    <TripContext.Provider value={{ trips, setTrips }}>
      <Stack />
    </TripContext.Provider>
  );
}
export default function Root() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
