import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { trips as tripsTable, categories as categoriesTable } from '@/db/schema';
import { Trip, TripContext } from '../_layout';

export default function TripDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [category, setCategory] = useState<{ name: string; colour: string; icon: string } | null>(null);

  if (!context) return null;

  const { trips, setTrips } = context;

  const trip = trips.find(
    (t: Trip) => t.id === Number(id)
  );

  useEffect(() => {
    if (!trip) return;

    const loadCategory = async () => {
      const rows = await db.select().from(categoriesTable);
      const found = rows.find(c => c.id === trip.categoryId) ?? null;
      setCategory(found);
    };

    void loadCategory();
  }, [trip]);

  if (!trip) return null;

  const deleteTrip = async () => {
    await db
      .delete(tripsTable)
      .where(eq(tripsTable.id, Number(id)));

    const rows = await db.select().from(tripsTable);
    setTrips(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={trip.title} subtitle="Trip details" />
      {category && (
        <View style={styles.categoryRow}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryText}>{category.name}</Text>
        </View>
      )}
      <View style={styles.tags}>
        <InfoTag label="Destination" value={trip.destination} />
        <InfoTag label="Start Date" value={trip.startDate} />
        <InfoTag label="End Date" value={trip.endDate} />
      </View>

      <PrimaryButton
        label="Edit"
        onPress={() =>
          router.push({
            pathname: '../trip/[id]/edit',
            params: { id }
          })
        }
      />

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete" variant="secondary" onPress={deleteTrip} />
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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 15,
    color: '#2c333c',
  },
});
