import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TripContext } from './_layout';
import DateTimePicker from '@react-native-community/datetimepicker'

export default function AddTrip() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [starting, setStarting] = useState<Date | null>(null);
  const [ending, setEnding] = useState<Date | null>(null);
  const [showStartingPicker, setShowStartingPicker] = useState(false);
  const [showEndingPicker, setShowEndingPicker] = useState(false);
  const formatDate = (date: Date) => { const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  if (!context) return null;
  const { setTrips } = context;
  const saveTrip = async () => {
    if (!title || !destination || !startDate || !endDate ) {
      Alert.alert('Missing fields', 'Please enter a title, destination, start date, and end date.');
      return;
    }
    if (endDate < startDate) {
      Alert.alert('Invalid dates', 'End date cannot be before the start date.');
      return;
    }
    await db.insert(tripsTable).values({
      title,
      destination,
      startDate,
      endDate,
      notes,
    });
    const rows = await db.select().from(tripsTable);
    setTrips(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Add Trip" subtitle="Create a new trip." />
        <View style={styles.form}>
          <FormField label="Title" value={title} onChangeText={setTitle} />
          <FormField label="Destination" value={destination} onChangeText={setDestination} />
          <View style={styles.dateField}>
          <Text style={styles.label}>Start Date</Text>
          <Pressable style={styles.filterButton} onPress={() => setShowStartingPicker(true)}>
            <Text style={[styles.filterButtonText, !starting ? styles.placeholderText : null]}>{starting ? formatDate(starting) : 'Select start date'}</Text>
          </Pressable>
          {showStartingPicker && (
            <DateTimePicker
              value={starting || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {setShowStartingPicker(false); if (selectedDate) {setStarting(selectedDate); setStartDate(formatDate(selectedDate));}}}/>
              )}
          </View>
          <View style={styles.dateField}>
          <Text style={styles.label}>End Date</Text>
          <Pressable style={styles.filterButton} onPress={() => setShowEndingPicker(true)}>
            <Text style={[styles.filterButtonText, !ending ? styles.placeholderText : null]}>{ending ? formatDate(ending) : 'Select end date'}</Text>
          </Pressable>
          {showEndingPicker && (
            <DateTimePicker
              value={ending || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {setShowEndingPicker(false); if (selectedDate) {setEnding(selectedDate); setEndDate(formatDate(selectedDate));}}} />
              )}
          </View>
          <FormField label="Notes" value={notes} onChangeText={setNotes} />
        </View>
        <PrimaryButton label="Save Trip" variant="accent" onPress={saveTrip} />
        <View style={styles.backButton}>
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
  content: {
    paddingBottom: 28,
    paddingTop: 6,
  },
  form: {
    marginBottom: 6,
  },
  dateField: {
    marginBottom: 12,
  },
  backButton: {
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterButtonText: {
    color: '#0F172A',
    fontSize: 15,
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  placeholderText: {
    color: '#94A3B8',
  }
});
