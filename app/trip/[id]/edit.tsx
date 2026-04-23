import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { ScrollView, StyleSheet, View, Pressable, Text, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { Trip, TripContext } from '../../_layout';
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/db/cloudinary';


export default function EditTrip() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [starting, setStarting] = useState<Date | null>(null);
  const [ending, setEnding] = useState<Date | null>(null);
  const [showStartingPicker, setShowStartingPicker] = useState(false);
  const [showEndingPicker, setShowEndingPicker] = useState(false);
  const formatDate = (date: Date) => { const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
  const trip = context?.trips.find(
    (t: Trip) => t.id === Number(id)
  );

  useEffect(() => {
    if (!trip) return;
    setTitle(trip.title);
    setDestination(trip.destination);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setNotes(trip.notes ?? '');
    setUploadedUrl(trip.imageUrl ?? '');
  }, [trip]);

  const pickImage = async () => {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    return Alert.alert("Permission needed", "Please allow photo access.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.8,
    allowsEditing: true,
  });

  if (result.canceled) return;

  const uri = result.assets?.[0]?.uri;
  if (!uri) return;

  setLocalUri(uri);
};
// Code taken from FYP project for uploading images to Cloudinary
  const uploadToCloudinary = async () => {
    if (!localUri) return Alert.alert("No image", "Pick an image first.");
    setUploading(true);
    try {
      const form = new FormData();
      form.append(
        "file",
        {uri: localUri, name: "trip.jpg", type: "image/jpeg",} as any
      );
      form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: form,}
      );
      const data = await res.json();
      if (!res.ok) {return Alert.alert("Upload failed", data?.error?.message || "Cloudinary error");}

      setUploadedUrl(data.secure_url);
      Alert.alert("Uploaded", "Image uploaded to Cloudinary!");
    } catch {
      Alert.alert("Error", "Could not upload image.");
    } finally {
      setUploading(false);
    }
  };
// End

  if (!context || !trip) return null;

  const { setTrips } = context;

  const saveChanges = async () => {
  if (!title || !destination || !startDate || !endDate) {
    Alert.alert('Missing fields', 'Please fill in all required fields');
    return; }
  if (endDate < startDate) {
    Alert.alert('Invalid dates', 'End Date cannot be before Start Date');
    return; }

    await db
      .update(tripsTable)
      .set({ title, destination, startDate, endDate, notes, imageUrl: uploadedUrl || null })
      .where(eq(tripsTable.id, Number(id)));
    const rows = await db.select().from(tripsTable);
    setTrips(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.listContent}>
      <ScreenHeader title="Edit Trip" subtitle={`Update ${trip.title}`} />
      <View style={styles.form}>
        <FormField label="Title" value={title} onChangeText={setTitle} />
        <FormField label="Destination" value={destination} onChangeText={setDestination} />
          <View style={styles.dateField}>
          <Text style={styles.label}>Start Date</Text>
          <Pressable style={styles.filterButton} onPress={() => setShowStartingPicker(true)}>
            <Text style={[styles.filterButtonText, !startDate ? styles.placeholderText : null]}>{startDate || 'Select start date'}</Text>
          </Pressable>
          {showStartingPicker && (
            <DateTimePicker
              value={starting || new Date(startDate)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {setShowStartingPicker(false); if (selectedDate) {setStarting(selectedDate); setStartDate(formatDate(selectedDate));}}}/>
              )}
          </View>
          <View style={styles.dateField}>
          <Text style={styles.label}>End Date</Text>
          <Pressable style={styles.filterButton} onPress={() => setShowEndingPicker(true)}>
            <Text style={[styles.filterButtonText, !endDate ? styles.placeholderText : null]}>{endDate || 'Select end date'}</Text>
          </Pressable>
          {showEndingPicker && (
            <DateTimePicker
              value={ending || new Date(endDate)}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {setShowEndingPicker(false); if (selectedDate) {setEnding(selectedDate); setEndDate(formatDate(selectedDate));}}} />
              )}
          </View>
        <FormField label="Notes" value={notes} onChangeText={setNotes} />
      </View>

      <View style={styles.photoSection}>
      {/* Image upload section taken from FYP project */}
      <Text style={styles.label}>Trip Photo</Text>
      <PrimaryButton label="Pick Image" variant="secondary" onPress={pickImage} />
      {localUri ? (<Image source={{ uri: localUri }} style={styles.tripImage} resizeMode="cover" />)
       : uploadedUrl ? (<Image source={{ uri: uploadedUrl }} style={styles.tripImage} resizeMode="cover" />) : null}
      <View style={styles.buttonSpacing}>
        <PrimaryButton label={uploading ? "Uploading..." : "Upload Photo"} variant="accent" onPress={uploadToCloudinary}/>
      </View>
      </View>
      {/* End */}
      <PrimaryButton label="Save Changes" variant="accent" onPress={saveChanges} />
      <View style={styles.buttonSpacing}>
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
  form: {
    marginBottom: 6,
  },
  dateField: {
    marginBottom: 12,
  },
  buttonSpacing: {
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 28,
    paddingTop: 6,
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
  },
  photoSection: {
    marginTop: 10,
    marginBottom: 12,
  },
  tripImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  }
});
