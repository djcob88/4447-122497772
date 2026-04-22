import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { categories as categoriesTable, targets as targetsTable } from '@/db/schema';

export type Category = {
  id: number;
  name: string;
  colour: string;
  icon: string;
};

export type Target = {
  id: number;
  timePeriod: string;
  targetMinutes: number;
  categoryId: number;
};

export default function EditTarget() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [target, setTarget] = useState<Target | null>(null);
  const [timePeriod, setTimePeriod] = useState('');
  const [targetMinutes, setTargetMinutes] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
    const deleteTarget = async () => {
    await db
      .delete(targetsTable)
      .where(eq(targetsTable.id, Number(id)));

    router.back();
};

  useEffect(() => {
    const loadCategories = async () => {
    const categories = await db.select().from(categoriesTable);
    setCategories(categories);
  };

    void loadCategories();
  }, []);

  useEffect(() => {
    const loadTarget = async () => {
      const targets = await db.select().from(targetsTable);
      const foundTarget = targets.find((t) => t.id === Number(id)) ?? null;

        if (!foundTarget) return;
        setTarget(foundTarget);
        setTimePeriod(foundTarget.timePeriod);
        setTargetMinutes(String(foundTarget.targetMinutes));
        setCategoryId(String(foundTarget.categoryId));
    };
    void loadTarget();
  }, [id]);

  if (!target) return null;

  const saveChanges = async () => {
    if (!timePeriod || !targetMinutes || !categoryId) return;
    if (timePeriod !== 'weekly' && timePeriod !== 'monthly') return;
    await db
      .update(targetsTable)
      .set({ timePeriod, targetMinutes: Number(targetMinutes), categoryId: Number(categoryId) })
      .where(eq(targetsTable.id, Number(id)));

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.listContent}>
        <ScreenHeader title="Edit Target" subtitle="Update your target" />

        <View style={styles.form}>
          <FormField label="Time Period" value={timePeriod} onChangeText={setTimePeriod} />
          <FormField label="Target Minutes" value={targetMinutes} onChangeText={setTargetMinutes} />
          <FormField label="Category ID" value={categoryId} onChangeText={setCategoryId} />
        </View>
        <View style={styles.categoryBox}>
          <Text style={styles.categoryTitle}>Categories</Text>
          {categories.map((category) => (
            <Text key={category.id} style={styles.categoryText}> {category.id}. {category.icon} {category.name} </Text>
          ))}
        </View>

        <PrimaryButton label="Save Changes" variant="accent" onPress={saveChanges} />
        <View style={styles.backButton}>
          <PrimaryButton label="Delete Target" variant="secondary" onPress={deleteTarget} />
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
  listContent: {
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
    color: '#032a85',
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
