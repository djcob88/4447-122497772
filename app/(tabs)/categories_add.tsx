import ScreenHeader from "@/components/ui/screen-header";
import PrimaryButton from '@/components/ui/primary-button';
import FormField from "@/components/ui/form-field";
import { db } from "@/db/client";
import { categories as categoriesTable } from "@/db/schema";
import { useState } from "react";
import { useRouter } from "expo-router";
import { 
    ScrollView, 
    StyleSheet, 
    View, Pressable, Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddCategory() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [colour, setColour] = useState('');
    const [icon, setIcon] = useState('');

    const saveCategory = async () => {
        if (!name || !colour || !icon) return;
        await db.insert(categoriesTable).values({
            name,
            colour,
            icon
        });
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
        <ScreenHeader title="Add Category" subtitle="Create a new category" />
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
        <PrimaryButton label="Save Category" variant="accent" onPress={saveCategory} />

        <View style={styles.backButton}>
          <PrimaryButton
            label="Cancel"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  listContent: {
    paddingBottom: 28,
    paddingTop: 6,
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
  backButton: {
    marginTop: 10,
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
