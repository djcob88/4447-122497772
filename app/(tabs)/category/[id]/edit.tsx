import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';


export type Category = {
  id: number;
  name: string;
  colour: string;
  icon: string;
};

export default function EditCategory() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [colour, setColour] = useState('');
  const [icon, setIcon] = useState('');
  const deleteCategory = async () => {
  await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, Number(id)));

  router.back();
};

  useEffect(() => {
    const loadCategory = async () => {
      const categories = await db.select().from(categoriesTable);
      const foundCategory = categories.find((c) => c.id === Number(id)) ?? null;

      if (!foundCategory) return;
      setCategory(foundCategory);
      setName(foundCategory.name);
      setColour(foundCategory.colour);
      setIcon(foundCategory.icon);
    };
    void loadCategory();
  }, [id]);

  if (!category) return null;

  const saveChanges = async () => {
    await db
      .update(categoriesTable)
      .set({ name, colour, icon })
      .where(eq(categoriesTable.id, Number(id)));

    router.back();
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.listContent}>
      <ScreenHeader title="Edit Category" subtitle={`Update ${category.name}`} />
      <View style={styles.form}>
        <FormField label="Name" value={name} onChangeText={setName} />
        <FormField label="Colour (hex)" value={colour} onChangeText={setColour} />
        <FormField label="Icon (emoji)" value={icon} onChangeText={setIcon} />
      </View>

      <PrimaryButton label="Save Changes" onPress={saveChanges} />
      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete Category" variant="secondary" onPress={deleteCategory} />
      </View>
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