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
    View, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from 'react-native-element-dropdown';

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
    if (!timePeriod || !targetMinutes || !categoryId) {
      Alert.alert('Missing fields', 'Please fill in all required fields');
      return; }
    if (timePeriod !== 'weekly' && timePeriod !== 'monthly') {
      Alert.alert('Invalid time period', 'Please select weekly or monthly');
      return; }
    if (Number(targetMinutes) <= 0 || Number.isNaN(Number(targetMinutes))) {
      Alert.alert('Invalid target', 'Target minutes must be greater than 0.');
      return; }
    if (Number(categoryId) <= 0 || Number.isNaN(Number(categoryId))) {
      Alert.alert('Invalid category', 'Please enter a valid category ID.');
      return; }
        await db.insert(targetsTable).values({
            timePeriod,
            targetMinutes: Number(targetMinutes),
            categoryId: Number(categoryId)
        });
    router.back();
};
const timeOptions = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

    return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.listContent}>
        <ScreenHeader title="Add Target" subtitle="Make a new target for your trips"/>
        <View style={styles.form}>
          <Text style={styles.label}>Time Period</Text>
          <Dropdown
            style={styles.dropdown}
            data={timeOptions}
            labelField="label"
            valueField="value"
            placeholder="Select time period"
            value={timePeriod}
            onChange={(item) => setTimePeriod(item.value)}
            />
          <FormField label="Target Minutes" value={targetMinutes} onChangeText={setTargetMinutes}/>
          <FormField label="Category ID" value={categoryId} onChangeText={setCategoryId}/>
        </View>
        <View style={styles.categoryBox}>
          <Text style={styles.categoryTitle}>Categories</Text>
          {categories.map((category) => (
            <Text key={category.id} style={styles.categoryText}>{category.id}. {category.icon} {category.name}</Text>
          ))}
        </View>

        <PrimaryButton label="Save Target" variant="accent" onPress={saveTarget} />
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
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});
