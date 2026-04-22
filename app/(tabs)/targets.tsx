import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { activities as activitiesTable, targets as targetsTable, categories as categoriesTable } from '@/db/schema';
import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { 
    ScrollView, 
    StyleSheet, 
    Text, 
    View,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '@/components/ui/primary-button';

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
    categoryId: number;
}

export type Category = {
    id: number;
    name: string;
    colour: string;
    icon: string;
}

// Code for helper functions for date calculations created with help from ChatGPT: https://chatgpt.com/share/69e4d2f7-1c54-83eb-858c-540751bbe001
function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getStartOfWeek(date: Date) {
  const result = new Date(date);
  const day = result.getDay(); 
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getEndOfWeek(date: Date) {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}


function getStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function getEndOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function isDateInRange(dateString: string, start: Date, end: Date) {
  const date = parseLocalDate(dateString);
  return date >= start && date <= end;
}

function getCurrentMinutesForTarget(activities: Activity[], target: Target) {
  const now = new Date();

  let start: Date;
  let end: Date;

  if (target.timePeriod.toLowerCase() === 'weekly') {
    start = getStartOfWeek(now);
    end = getEndOfWeek(now);
  } else if (target.timePeriod.toLowerCase() === 'monthly') {
    start = getStartOfMonth(now);
    end = getEndOfMonth(now);
  } else {
    return activities
      .filter((activity) => activity.categoryId === target.categoryId)
      .reduce((sum, activity) => sum + activity.durationMinutes, 0);
  }

  return activities
    .filter(
      (activity) =>
        activity.categoryId === target.categoryId &&
        isDateInRange(activity.date, start, end)
    )
    .reduce((sum, activity) => sum + activity.durationMinutes, 0);
}
// End 

export default function TargetsScreen() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [targets, setTargets] = useState<Target[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();

    useFocusEffect(
    useCallback(() => {
        const data = async () => {
        const activities = await db.select().from(activitiesTable);
        const targets = await db.select().from(targetsTable);
        const categories = await db.select().from(categoriesTable);
        setActivities(activities);
        setTargets(targets);
        setCategories(categories);
        };

        void data();
    }, [])
);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Targets" subtitle="View your progress on your existing targets"/>

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Add Target" variant="accent" onPress={() => router.push('./targets_add')} />
      </View>

      <ScrollView style={styles.targetList} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {targets.length === 0 ? (
          <Text style={styles.emptyText}>No targets set yet</Text>
        ) : (
          targets.map((target) => {
            const category = categories.find((category) => category.id === target.categoryId);
            const currentMinutes = getCurrentMinutesForTarget(activities, target);
            const remaining = target.targetMinutes - currentMinutes; 
            const progress = Math.min((currentMinutes / target.targetMinutes) * 100, 100); 

            return (
            <Pressable
              key={target.id}
              onPress={() =>
                router.push({
                  pathname: './target/[id]/edit' as any, params: { id: String(target.id) }
                })
              }
              style={({ pressed }) => [
                styles.card, pressed ? { opacity: 0.8 } : null,
              ]}
            >
                <Text style={styles.cardTitle}>{category ? `${category.icon} ${category.name}` : 'Category'}</Text> 
                <Text style={styles.metric}>Period: {target.timePeriod}</Text>
                <Text style={styles.metric}>Target: {target.targetMinutes} minutes</Text>
                <Text style={styles.metric}>Current: {currentMinutes} minutes</Text> 
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(progress)}% complete</Text> 
                <Text style={styles.status}>
                  {remaining > 0 ? `${remaining} minutes remaining` : remaining < 0 ? `${Math.abs(remaining)} minutes exceeded` : 'Target achieved'}
                </Text> 
              </Pressable>
            );
          })
        )}
      </ScrollView>
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
  targetList: {
    flex: 1,
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
  emptyText: {
    color: '#475569',
    fontSize: 16,
    paddingTop: 12,
    textAlign: 'center',
  },
  buttonSpacing: {
    marginTop: 12,
    marginBottom: 4,
  },
});
