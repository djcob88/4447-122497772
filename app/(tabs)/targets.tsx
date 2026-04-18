import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { activities as activitiesTable, targets as targetsTable } from '@/db/schema';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Activity = {
  id: number;
  tripId: number;
  title: string;
  date: string;
  durationMinutes: number;
  notes: string | null;
  categoryId: number;
};

export type Target = {
    id: number;
    timePeriod: string;
    targetMinutes: number;
}

export default function TargetsScreen() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [targets, setTargets] = useState<Target[]>([]);

    useFocusEffect(
    useCallback(() => {
        const data = async () => {
        const activities = await db.select().from(activitiesTable);
        const targets = await db.select().from(targetsTable);
        setActivities(activities);
        setTargets(targets);
        };

        void data();
    }, [])
);

    const totalMinutes = activities.reduce((sum, activity) => sum + activity.durationMinutes,0);
    const weeklyTarget = targets.find((target) => target.timePeriod === 'weekly');
    const monthlyTarget = targets.find((target) => target.timePeriod === 'monthly');
    const weeklyRemaining = weeklyTarget ? weeklyTarget.targetMinutes - totalMinutes: 0;
    const monthlyRemaining = monthlyTarget ? monthlyTarget.targetMinutes - totalMinutes: 0;
    const weeklyProgress = weeklyTarget ? Math.min((totalMinutes / weeklyTarget.targetMinutes) * 100, 100) : 0;
    const monthlyProgress = monthlyTarget ? Math.min((totalMinutes / monthlyTarget.targetMinutes) * 100, 100) : 0;


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Targets" subtitle="View your progress on your existing targets"/>

         <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Target</Text>
          <Text style={styles.metric}>Target: {weeklyTarget ? weeklyTarget.targetMinutes : 0} minutes </Text>
          <Text style={styles.metric}>Current: {totalMinutes} minutes</Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${weeklyProgress}%` },]}/>
          </View>
          <Text style={styles.progressText}> {Math.round(weeklyProgress)}% complete </Text>
          <Text style={styles.status}> {weeklyTarget ? weeklyRemaining > 0 ? `${weeklyRemaining} minutes remaining` : `${Math.abs(weeklyRemaining)} minutes exceeded` : 'No weekly targets are currently set'} </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Target</Text>
          <Text style={styles.metric}>Target: {monthlyTarget ? monthlyTarget.targetMinutes : 0} minutes </Text>
          <Text style={styles.metric}>Current: {totalMinutes} minutes</Text>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${monthlyProgress}%` },]}/>
          </View>
          <Text style={styles.progressText}> {Math.round(monthlyProgress)}% complete </Text>
          <Text style={styles.status}> {monthlyTarget ? monthlyRemaining > 0 ? `${monthlyRemaining} minutes remaining` : `${Math.abs(monthlyRemaining)} minutes exceeded` : 'No monthly targets are currently set'} </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#e4e4e4',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  metric: {
    color: '#334155',
    fontSize: 15,
    marginBottom: 6,
  },
  status: {
    color: '#00b4d0',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
  },
  progressBar: {
    marginTop: 8,
    marginBottom: 6,
    height: 10,
    backgroundColor: "#c9c9c9",
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressText: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00b4d0',
    borderRadius: 6,
  },
});