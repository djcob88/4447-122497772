import { Trip } from '@/app/_layout';
import TripDetails from '@/components/ui/trip-details';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  trip: Trip;
};

export default function TripCard({ trip }: Props) {
  const router = useRouter();
  const openDetails = () =>
    router.push({ pathname: '/trip/[id]', params: { id: trip.id.toString() } });
  const tripSummary = `${trip.title}, ${trip.destination}, ${trip.startDate}`;
  
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
      </View>
      <View style={styles.details}>
        <TripDetails destination={trip.destination} startDate={trip.startDate} endDate={trip.endDate} compact />
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
  details: {
    marginTop: 10,
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
