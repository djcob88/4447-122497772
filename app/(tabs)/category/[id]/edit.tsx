import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { StyleSheet, View, ScrollView, Pressable, Text, Alert } from 'react-native';
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
  if (!name || !colour || !icon) {
    Alert.alert('Missing fields', 'Please enter all fields before saving.');
    return; }
    await db
      .update(categoriesTable)
      .set({ name, colour, icon })
      .where(eq(categoriesTable.id, Number(id)));
    router.back();
  };

  // Preset colour options from ChatGPT: https://chatgpt.com/share/69e8bd1c-e6d8-83eb-b778-6b0c15e7f63d
  const PRESET_COLOURS = [
    "#7C3AED",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#e7ff0f",
    "#14B8A6",
    "#F97316",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1"
  ];
// End

const PRESET_ICONS = [
  "🏖️",
  "🍽️",
  "🎯",
  "🏞️",
  "✈️",
  "🏛️",
  "🎵",
  "🛍️",
  "🔭",
  "🎨",
  "🚶‍♂️",
  "🚴‍♀️",
  "🍹",
  "🍕",
  "⚽",
  "🌲",
];
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.listContent}>
      <ScreenHeader title="Edit Category" subtitle={`Update ${category.name}`} />
      <View style={styles.form}>
        <FormField label="Name" value={name} onChangeText={setName} />
        <Text style={styles.label}>Colour</Text>
        {/* Preset colour options from ChatGPT: https://chatgpt.com/share/69e8bd1c-e6d8-83eb-b778-6b0c15e7f63d */}
        <View style={styles.colourContainer}>
          {PRESET_COLOURS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColour(c)}
              style={[
                styles.colourCircle,
                { backgroundColor: c },
                colour === c && styles.selectedColour,
              ]}
            />
          ))}
        </View>
        {/* End */}
        <Text style={styles.label}>Icon</Text>
        {/* Based of colour picker changed for icons */}
        <View style={styles.iconContainer}>
          {PRESET_ICONS.map((i) => (
            <Pressable
              key={i}
              onPress={() => setIcon(i)}
              style={[
                styles.iconCircle,
                icon === i && styles.selectedIcon,
              ]}
            >
              <Text style={styles.iconText}>{i}</Text>
            </Pressable>
          ))}
        </View>
        {/* End */}
      </View>

      <PrimaryButton label="Save Changes" variant="accent" onPress={saveChanges} />
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
    paddingTop: 24,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  form: {
    marginBottom: 6,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 28,
    paddingTop: 6,
  },
  colourContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  colourCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColour: {
    borderWidth: 3,
    borderColor: "#000",
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIcon: {
    borderWidth: 3,
    borderColor: "#0F172A",
  },
  iconText: {
    fontSize: 22,
  },
});
