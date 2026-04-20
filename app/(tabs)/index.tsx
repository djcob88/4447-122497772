import TripCard from '@/components/TripCard';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trip, TripContext } from '../_layout';
import DateTimePicker from '@react-native-community/datetimepicker'

export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [starting, setStarting] = useState<Date | null>(null);
  const [ending, setEnding] = useState<Date | null>(null);
  const [showStartingPicker, setShowStartingPicker] = useState(false);
  const [showEndingPicker, setShowEndingPicker] = useState(false);  
  if (!context) return null;

  const { trips } = context;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTrips = trips.filter((trip: Trip) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      trip.title.toLowerCase().includes(normalizedQuery) ||
      trip.destination.toLowerCase().includes(normalizedQuery);
    
    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);
    const matchesStarting = !starting || tripEnd >= starting;
    const matchesEnding = !ending || tripStart <= ending;
    return matchesSearch && matchesStarting && matchesEnding;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Trips"
        subtitle={`${trips.length} planned`}
      />

      <PrimaryButton
        label="Add Trip"
        onPress={() => router.push({ pathname: '../add' })}
      />

      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by title or destination"
        style={styles.searchInput}
      />
      <View style={styles.filterRow}>
        <Pressable style={styles.filterButton} onPress={() => setShowStartingPicker(true)}>
          <Text style={styles.filterButtonText}>
            {starting ? `From: ${starting.toLocaleDateString()}` : 'From Date'}
          </Text>
        </Pressable>
        <Pressable style={styles.filterButton} onPress={() => setShowEndingPicker(true)}>
          <Text style={styles.filterButtonText}>
            {ending ? `To: ${ending.toLocaleDateString()}` : 'To Date'}
          </Text>
        </Pressable>
          <Pressable
          style={[styles.filterButton, styles.clearButton]}
          onPress={() => { setStarting(null); setEnding(null);}}>
          <Text style={styles.filterButtonText}>Clear</Text>
          </Pressable>
      </View>
      {showStartingPicker && (
        <View style={styles.pickerContainer}>
        <DateTimePicker
          value={starting ?? new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => { setShowStartingPicker(false); if (selectedDate) setStarting(selectedDate);}}/>
        </View> )}
      {showEndingPicker && (
        <View style={styles.pickerContainer}>
        <DateTimePicker
          value={ending ?? new Date()}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {setShowEndingPicker(false); if (selectedDate) setEnding(selectedDate);}}/>
        </View> )}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
>
        {filteredTrips.length === 0 ? (
          <Text style={styles.emptyText}>No trips match your search</Text>
        ) : (
          filteredTrips.map((trip: Trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))
        )}
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
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 8,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#E2E8F0',
  },
  pickerContainer: {
    marginTop: 10,
    alignItems: 'center',
  } 
});
