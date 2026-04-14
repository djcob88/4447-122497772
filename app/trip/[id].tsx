import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext } from 'react';
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { Trip, TripContext } from '../_layout';

export default function TripDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);

  if (!context) return null;

  const { trips, setTrips } = context;

  const trip = trips.find(
    (t: Trip) => t.id === Number(id)
  );

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
});
