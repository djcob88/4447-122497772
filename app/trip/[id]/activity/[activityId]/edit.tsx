import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { activities as activitiesTable, categories as categoriesTable } from '@/db/schema';

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
          <FormField label="Date" value={date} onChangeText={setDate} />
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

        <PrimaryButton label="Save Changes" onPress={saveChanges} />

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
  },
  content: {
    paddingBottom: 24,
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
});