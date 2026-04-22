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
  View, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trip, TripContext } from '../_layout';
import DateTimePicker from '@react-native-community/datetimepicker'
import { useAuth } from '@/context/authcontext';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default function IndexScreen() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [starting, setStarting] = useState<Date | null>(null);
  const [ending, setEnding] = useState<Date | null>(null);
  const [showStartingPicker, setShowStartingPicker] = useState(false);
  const [showEndingPicker, setShowEndingPicker] = useState(false); 
  const {logout, user} = useAuth();
  const deletion = async () => {
  if (!user) return;
  Alert.alert("Delete Account", "Are you sure you want to delete your account?",
    [{ text: "Cancel", style: "cancel" },
      {text: "Delete", style: "destructive",
        onPress: async () => { try { await db.delete(users).where(eq(users.id, user.id));
            logout();
          } catch {
            Alert.alert("Error", "Could not delete account");
          }}, }, ]
          );
        };
  if (!context) return null;
  const {trips} = context;
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
        variant="accent"
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
        style={styles.tripList}
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
      <View style={styles.accountActions}>
      <View style={styles.logout}>
        <PrimaryButton label="Logout" variant="secondary" onPress={logout}/>
      </View>
      <View style={styles.delete}>
        <PrimaryButton label="Delete Account" variant="danger" onPress={deletion} />
      </View>
      </View>
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
    paddingTop: 16,
  },
  tripList: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#94A3B8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 12,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#E2E8F0',
  },
  pickerContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  accountActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 12,
    marginBottom: 6,
    paddingTop: 4,
  },
  logout: {
    marginTop: 0,
},
  delete: {
    marginTop: 0,
    marginBottom: 0,
},
});
