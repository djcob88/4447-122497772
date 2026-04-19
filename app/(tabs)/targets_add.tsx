import FormField from "@/components/ui/form-field";
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { categories as categoriesTable, targets as targetsTable } from "@/db/schema";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type Category = {
  id: number;
  name: string;
  colour: string;
  icon: string;
};

export default function AddTarget() {
    const router = useRouter();
    const [timePeriod, setTimePeriod] = useState('');
    const [targetMinutes, setTargetMinutes] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            const categories = await db.select().from(categoriesTable);
            setCategories(categories);
        };
        void loadCategories();
    }, []);

    const saveTarget = async () => {
        if (!timePeriod || !targetMinutes || !categoryId) return;
        if (timePeriod !== 'weekly' && timePeriod !== 'monthly') return;
        await db.insert(targetsTable).values({
            timePeriod,
            targetMinutes: Number(targetMinutes),
            categoryId: Number(categoryId)
        });
    router.back();
};

    return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.listContent}>
        <ScreenHeader title="Add Target" subtitle="Make a new target for your trips"/>

        <View style={styles.form}>
          <FormField label="Time Period" value={timePeriod} onChangeText={setTimePeriod} placeholder="weekly or monthly"/>
          <FormField label="Target Minutes" value={targetMinutes} onChangeText={setTargetMinutes}/>
          <FormField label="Category ID" value={categoryId} onChangeText={setCategoryId}/>
        </View>
        <View style={styles.categoryBox}>
          <Text style={styles.categoryTitle}>Categories</Text>
          {categories.map((category) => (
            <Text key={category.id} style={styles.categoryText}>{category.id}. {category.icon} {category.name}</Text>
          ))}
        </View>

        <PrimaryButton label="Save Target" onPress={saveTarget} />
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
    padding: 20,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
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