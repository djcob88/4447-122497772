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
    View 
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

    return (
        <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.listContent}>
        <ScreenHeader title="Add Category" subtitle="Create a new category" />

        <View style={styles.form}>
          <FormField label="Name" value={name} onChangeText={setName} />
          <FormField label="Colour (hex)" value={colour} onChangeText={setColour} />
          <FormField label="Icon (emoji)" value={icon} onChangeText={setIcon} />
        </View>

        <PrimaryButton label="Save Category" onPress={saveCategory} />

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
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  form: {
    marginBottom: 6,
  },
  backButton: {
    marginTop: 10,
  },
});