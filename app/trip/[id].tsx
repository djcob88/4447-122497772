import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useContext, useEffect, useState, useCallback } from 'react';
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
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
    <ScrollView showsVerticalScrollIndicator={false}>
      <PrimaryButton label="Back" variant="secondary" onPress={() => router.back()}/>
      <ScreenHeader title={trip.title} subtitle="Trip details" />
      <View style={styles.tags}>
        <InfoTag label="Destination" value={trip.destination} />
        <InfoTag label="Start Date" value={trip.startDate} />
        <InfoTag label="End Date" value={trip.endDate} />
      </View>
      <PrimaryButton
        label="Edit"
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
          onPress={() =>
            router.push({pathname: '../trip/[id]/activities_add', params: { id }})
          }
        />
      </View>

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
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
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
});
