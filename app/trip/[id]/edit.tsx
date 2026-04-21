import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { Trip, TripContext } from '../../_layout';


export default function EditTrip() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const trip = context?.trips.find(
    (t: Trip) => t.id === Number(id)
  );

  useEffect(() => {
    if (!trip) return;
    setTitle(trip.title);
    setDestination(trip.destination);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setNotes(trip.notes ?? '');
  }, [trip]);



  if (!context || !trip) return null;

  const { setTrips } = context;

  const saveChanges = async () => {
    await db
      .update(tripsTable)
      .set({ title, destination, startDate, endDate, notes })
      .where(eq(tripsTable.id, Number(id)));

    const rows = await db.select().from(tripsTable);
    setTrips(rows);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.listContent}>
      <ScreenHeader title="Edit Trip" subtitle={`Update ${trip.title}`} />
      <View style={styles.form}>
        <FormField label="Title" value={title} onChangeText={setTitle} />
        <FormField label="Destination" value={destination} onChangeText={setDestination} />
        <FormField label="Start Date" value={startDate} onChangeText={setStartDate} />
        <FormField label="End Date" value={endDate} onChangeText={setEndDate} />
        <FormField label="Notes" value={notes} onChangeText={setNotes} />
      </View>

      <PrimaryButton label="Save Changes" onPress={saveChanges} />
      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 6,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
});
