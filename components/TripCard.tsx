import { Trip } from '@/app/_layout';
import InfoTag from '@/components/ui/info-tag';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { db } from '@/db/client';
import { categories as categoriesTable } from '@/db/schema';

type Props = {
  trip: Trip;
};

export default function TripCard({ trip }: Props) {
  const router = useRouter();
  const openDetails = () =>
    router.push({ pathname: '/trip/[id]', params: { id: trip.id.toString() } });
  const tripSummary = `${trip.title}, ${trip.destination}, ${trip.startDate}`;
  const [category, setCategory] = useState<{ name: string; colour: string; icon: string } | null>(null);

  useEffect(() => {
    const loadCategory = async () => {
      const rows = await db.select().from(categoriesTable);
      const found = rows.find(c => c.id === trip.categoryId) ?? null;
      setCategory(found);
  };

  void loadCategory();
}, [trip.categoryId]);

  return (
    <Pressable
      accessibilityLabel={`${tripSummary}, view details`}
      accessibilityRole="button"
      onPress={openDetails}
      style={({ pressed }) => [
        styles.card,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <View>
        <Text style={styles.title}>{trip.title}</Text>
        <Text style={styles.destination}>{trip.destination}</Text>
        {category && (
          <View style={styles.categoryRow}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
)}
      </View>

      <View style={styles.tags}>
        <InfoTag label="Start Date" value={trip.startDate} />
        <InfoTag label="End Date" value={trip.endDate} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  destination: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    color: '#2c333c',
  },
});
