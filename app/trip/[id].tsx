import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useContext, useEffect, useState, useCallback } from 'react';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import TripDetails from '@/components/ui/trip-details';
import { StyleSheet, View, Text, ScrollView, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { trips as tripsTable, categories as categoriesTable, activities as activitiesTable } from '@/db/schema';
import { Trip, TripContext } from '../_layout';
import { Dropdown } from 'react-native-element-dropdown';

export type Activity = {
  id: number;
  tripId: number;
  title: string;
  date: string;
  durationMinutes: number;
  notes: string | null;
  categoryId: number;
};

export default function TripDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string; colour: string; icon: string }[]>([]);

  if (!context) return null;

  const { trips, setTrips } = context;

  const trip = trips.find(
    (t: Trip) => t.id === Number(id)
  );

  useEffect(() => {
    const loadCategories = async () => {
      const rows = await db.select().from(categoriesTable);
      setCategories(rows);
    };
    void loadCategories();
  }, []);

 useFocusEffect(
  useCallback(() => {
    if (!trip) return;
    const loadActivities = async () => {
      const rows = await db.select().from(activitiesTable);
      const activities = rows.filter(a => a.tripId === trip.id);
      setActivities(activities);
    };
    void loadActivities();
    }, [trip])
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

const filteredActivities = activities.filter((a) => {if (categoryId === null) return true;
  return a.categoryId === categoryId;
});

  const dropdown = [
    { label: 'All', value: null}, ...categories.map(c => ({ label: `${c.icon} ${c.name}`, value: c.id }))
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader title={trip.title} subtitle="Trip details" />
      {/* Trip image section */}
      {trip.imageUrl ? (
        <View style={styles.imageCard}>
          <ImageBackground
            source={{ uri: trip.imageUrl }}
            style={styles.tripImage}
            imageStyle={styles.tripImageSource}
            resizeMode="cover">
            <View style={styles.tripImageOverlay}>
              <View style={styles.tripImageBadge}>
                <Text style={styles.tripImageBadgeText}>Trip photo</Text>
              </View>
              <View style={styles.tripImageInfo}>
                <Text style={styles.tripImageTitle}>{trip.title}</Text>
                <Text style={styles.tripImageSubtitle}>{trip.destination}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      ) : null}
      {/* End */}
      <View style={styles.detailsCard}>
        <TripDetails destination={trip.destination} startDate={trip.startDate} endDate={trip.endDate} />
      </View>
      <PrimaryButton
        label="Edit"
        variant="accent"
        onPress={() =>
          router.push({ pathname: '../trip/[id]/edit',
            params: { id }
          })
        }
      />
      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete" variant="secondary" onPress={deleteTrip} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activities</Text>
        <Dropdown
          style={styles.dropdown}
          data={dropdown}
          value={categoryId}
          onChange={(item) => setCategoryId(item.value)}
          labelField="label"
          valueField="value"
          placeholder="Filter by category"
        />

        {filteredActivities.length === 0 && (
          <Text style={styles.emptyText}>No activities added for this category yet</Text>
        )}
        {filteredActivities.map((activity) => (
          <Pressable key={activity.id}
            onPress={() =>
              router.push({ pathname: '../trip/[id]/activity/[activityId]/edit' as any, params: { id, activityId: String(activity.id) }})
            }
            style={({ pressed }) => [styles.activityItem, pressed ? { opacity: 0.8 } : null,]}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityDate}>{activity.date}</Text>
            <Text style={styles.activityDuration}>{activity.durationMinutes} minutes</Text>
            {activity.notes && (
              <Text style={styles.activityNotes}>{activity.notes}</Text>
            )}
          </Pressable>
        ))}

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Add Activity"
          variant="accent"
          onPress={() =>
            router.push({pathname: '../trip/[id]/activities_add', params: { id }})
          }
        />
      </View>

      </View>
      </ScrollView>
      <View style={styles.backButton}>
        <PrimaryButton label="Back" variant="secondary" onPress={() => router.back()}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
  },
  content: {
    paddingBottom: 92,
    paddingTop: 6,
  },
  detailsCard: {
    marginBottom: 18,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6E3EA',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 4,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    color: '#475569',
    fontSize: 15,
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  activityTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  activityDate: {
    color: '#475569',
    fontSize: 14,
    marginTop: 4,
  },
  activityDuration: {
    color: '#475569',
    fontSize: 14,
    marginTop: 2,
  },
  activityNotes: {
    color: '#334155',
    fontSize: 14,
    marginTop: 6,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#c4c4c4',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  backButton: {
    bottom: 20,
    left: 20,
    position: 'absolute',
  },
  tripImage: {
    backgroundColor: '#CFE9EF',
    height: 240,
    justifyContent: 'space-between',
  },
  tripImageSource: {
    borderRadius: 17,
  },
  tripImageOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.18)',
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  tripImageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tripImageBadgeText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  tripImageInfo: {
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tripImageTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  tripImageSubtitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});
