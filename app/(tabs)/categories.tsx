import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';
import { use, useCallback, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    View,
    Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/ui/primary-button';


export type Category = {
    id: number;
    name: string;
    colour: string;
    icon: string;
};

export default function CategoriesScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();

    useFocusEffect(
      useCallback(() => {
        const loadCategories = async () => {
          const rows = await db.select().from(categoriesTable);
          setCategories(rows);
        };

    void loadCategories();
  }, [])
);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Categories"
        subtitle={`${categories.length} available`}
      />
      
      <PrimaryButton
        label="Add Category"
        onPress={() => router.push('./categories_add')}
      />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.length === 0 ? (
          <Text style={styles.emptyText}>No categories found</Text>
        ) : (
          categories.map((category) => (
        <Pressable
          key={category.id}
          onPress={() =>
            router.push({ pathname: `./category/${category.id}/edit` as any,})
          }
          style={({ pressed }) => [ styles.card, pressed ? { opacity: 0.8 } : null,]}
        >
          <View
            style={[
              styles.colourDot,
              { backgroundColor: category.colour },
            ]}
          />
          <Text style={styles.icon}>{category.icon}</Text>
          <Text style={styles.name}>{category.name}</Text>
        </Pressable>
      ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
    colourDot: {
    borderRadius: 999,
    height: 20,
    width: 20,
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    color: '#0F172A',
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
});