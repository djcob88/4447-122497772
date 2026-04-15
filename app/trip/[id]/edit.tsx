import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { trips as tripsTable, categories as categoriesTable } from '@/db/schema';
import { Trip, TripContext } from '../../_layout';

export type Category = {
  id: number;
  name: string;
  colour: string;
  icon: string;
};

export default function EditTrip() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
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
    setCategoryId(String(trip.categoryId));
  }, [trip]);

  useEffect(() => {
    const loadCategories = async () => {
      const rows = await db.select().from(categoriesTable);
      setCategories(rows);
    };

    void loadCategories();
  }, []);

  if (!context || !trip) return null;

  const { setTrips } = context;

  const saveChanges = async () => {
    await db
      .update(tripsTable)
      .set({ title, destination, startDate, endDate, notes, categoryId: Number(categoryId) })
      .where(eq(tripsTable.id, Number(id)));

    const rows = await db.select().from(tripsTable);
    setTrips(rows);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Edit Trip" subtitle={`Update ${trip.title}`} />
      <View style={styles.form}>
        <FormField label="Title" value={title} onChangeText={setTitle} />
        <FormField label="Destination" value={destination} onChangeText={setDestination} />
        <FormField label="Start Date" value={startDate} onChangeText={setStartDate} />
        <FormField label="End Date" value={endDate} onChangeText={setEndDate} />
        <FormField label="Notes" value={notes} onChangeText={setNotes} />
        <FormField label="Category ID" value={categoryId} onChangeText={setCategoryId} />
      </View>

      <View style={styles.categoryBox}>
        <Text style={styles.categoryTitle}>Categories</Text>
        {categories.map(category => (
          <Text key={category.id} style={styles.categoryText}>
            {category.id} {category.icon} {category.name}
          </Text>
        ))}
      </View>

      <PrimaryButton label="Save Changes" onPress={saveChanges} />
      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Cancel" variant="secondary" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 6,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  categoryBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  categoryTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  categoryText: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 4,
  },
});
