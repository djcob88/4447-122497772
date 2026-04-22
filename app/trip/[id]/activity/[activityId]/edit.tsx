import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { activities as activitiesTable, categories as categoriesTable } from '@/db/schema';
import DateTimePicker from "@react-native-community/datetimepicker";

export type Category = {
  id: number;
  name: string;
  colour: string;
  icon: string;
};

export type Activity = {
  id: number;
  tripId: number;
  title: string;
  date: string;
  durationMinutes: number;
  notes: string | null;
  categoryId: number;
};

export default function EditActivity() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [activity, setActivity] = useState<Activity | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [starting, setStarting] = useState<Date | null>(null);
  const [showStartingPicker, setShowStartingPicker] = useState(false);
  const formatDate = (date: Date) => { const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

    useEffect(() => {
        const loadCategories = async () => {
            const categories = await db.select().from(categoriesTable);
            setCategories(categories);
        };

        void loadCategories();
    }, []);

  useEffect(() => {
    const loadActivity = async () => {
      const activities = await db.select().from(activitiesTable);
      const found = activities.find((a) => a.id === Number(activityId)) || null;

        if (found) {
            setActivity(found);
            setTitle(found.title);
            setDate(found.date);
            setDurationMinutes(String(found.durationMinutes));
            setNotes(found.notes ?? '');
            setCategoryId(String(found.categoryId));
        }
    };

        void loadActivity();
    }, [activityId]);

  if (!activity) return null;

  const saveChanges = async () => {
    await db
      .update(activitiesTable)
      .set({ title, date, durationMinutes: Number(durationMinutes), notes, categoryId: Number(categoryId) })
      .where(eq(activitiesTable.id, Number(activityId)));

    router.back();
  };

  const deleteActivity = async () => {
    await db.delete(activitiesTable).where(eq(activitiesTable.id, Number(activityId)));
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Edit Activity" subtitle={`Update ${activity.title}`} />

        <View style={styles.form}>
          <FormField label="Title" value={title} onChangeText={setTitle} />
          <View style={styles.dateField}>
          <Text style={styles.label}>Date</Text>
          <Pressable style={styles.filterButton} onPress={() => setShowStartingPicker(true)}>
            <Text style={[styles.filterButtonText, !date ? styles.placeholderText : null]}>{date || 'Select date'}</Text>
          </Pressable>
          {showStartingPicker && (
            <DateTimePicker
              value={starting || new Date(date)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {setShowStartingPicker(false); if (selectedDate) {setStarting(selectedDate); setDate(formatDate(selectedDate));}}}/>
            )}
        </View>
          <FormField label="Duration Minutes" value={durationMinutes} onChangeText={setDurationMinutes} />
          <FormField label="Notes" value={notes} onChangeText={setNotes} />
          <FormField label="Category ID" value={categoryId} onChangeText={setCategoryId} />
        </View>

        <View style={styles.categoryBox}>
          <Text style={styles.categoryTitle}>Categories</Text>
          {categories.map((category) => (
            <Text key={category.id} style={styles.categoryText}>
              {category.id}. {category.icon} {category.name}
            </Text>
          ))}
        </View>
        <PrimaryButton label="Save Changes" variant="accent" onPress={saveChanges} />
        <View style={styles.backButton}>
          <PrimaryButton label="Delete" variant="secondary" onPress={deleteActivity} />
        </View>

        <View style={styles.backButton}>
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
    paddingTop: 24,
  },
  content: {
    paddingBottom: 28,
    paddingTop: 6,
  },
  form: {
    marginBottom: 6,
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
  backButton: {
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterButtonText: {
    color: '#0F172A',
    fontSize: 15,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  placeholderText: {
    color: '#94A3B8',
  },
  dateField: {
    marginBottom: 12,
  },
});
