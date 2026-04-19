import ScreenHeader from "@/components/ui/screen-header";
import { db } from "@/db/client";
import { categories as categoriesTable, activities as activitiesTable } from "@/db/schema";
import { useFocusEffect } from "expo-router";
import { useState, useCallback, useMemo } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View, Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PieChart from "react-native-pie-chart";

export type Category = {
    id: number;
    name: string;
    colour: string;
    icon: string;
};

export type Activity = {
    id: number;
    tripId: number;
    title: string;
    date: string;
    durationMinutes: number;
    notes: string | null;
    categoryId: number;
};

export default function Insights() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [period, setPeriod] = useState("weekly");
    useFocusEffect(
        useCallback(() => {
            const data = async () => {
            const categories = await db.select().from(categoriesTable);
            const activities = await db.select().from(activitiesTable);
                setCategories(categories);
                setActivities(activities);
            };
            void data();
        }, [])
    );

const filtered = useMemo(() => {
    const now = new Date();
    return activities.filter((activity) => {
        const date = new Date(activity.date);
        if (period === "daily") {
            return date.toDateString() === now.toDateString();
        }
        // Help getting a weekly range that starts on Monday and ends on Sunday from ChatGPT: https://chatgpt.com/share/69e54301-03d4-83eb-8d03-1f8e7d530224
        if (period === "weekly") {
            const startOfWeek = new Date(now);

            const day = startOfWeek.getDay(); 
            const diff = day === 0 ? -6 : 1 - day;

            startOfWeek.setDate(startOfWeek.getDate() + diff);
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            return date >= startOfWeek && date <= endOfWeek;
}           
        // End
        if (period === "monthly") {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }
        return false;
    });
}, [activities, period]);

const totalMins = filtered.reduce((sum, activity) => sum + activity.durationMinutes, 0);
const totalActivities = filtered.length;
const categoryData = categories.map((category) => {
    const categoryMins = filtered
        .filter((activity) => activity.categoryId === category.id)
        .reduce((sum, activity) => sum + activity.durationMinutes, 0);
    return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        colour: category.colour,
        minutes: categoryMins,
    };
}).filter((data) => data.minutes > 0);
const widthAndHeight = 180;
// Help with fixing error with series variable for PieChart from ChatGPT: https://chatgpt.com/share/69e54447-0f04-83eb-9211-c47c1d43c451
const series =
  categoryData.length > 0
    ? categoryData.map((data) => ({
        value: data.minutes,
        color: data.colour,
      }))
    : [{ value: 1, color: "#adacac" }];
// End
    return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        <ScreenHeader title="Insights" subtitle="View daily, weekly and monthly activity insights"/>

        <View style={styles.periodRow}>
          <Pressable onPress={() => setPeriod("daily")} style={[styles.periodButton, period === "daily" ? styles.activeButton : null]}>
            <Text style={[styles.periodButtonText, period === "daily" ? styles.activeButtonText : null]}>Daily</Text>
          </Pressable>
          <Pressable onPress={() => setPeriod("weekly")} style={[styles.periodButton, period === "weekly" ? styles.activeButton : null]}>
            <Text style={[styles.periodButtonText, period === "weekly" ? styles.activeButtonText : null]}>Weekly</Text>
          </Pressable>
          <Pressable onPress={() => setPeriod("monthly")} style={[styles.periodButton, period === "monthly" ? styles.activeButton : null]}>
            <Text style={[styles.periodButtonText, period === "monthly" ? styles.activeButtonText : null]}>Monthly</Text>
          </Pressable>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <Text style={styles.metric}>Activities: {totalActivities}</Text>
          <Text style={styles.metric}>Minutes: {totalMins}</Text>
          </View>

        <View style={styles.card}>
           <Text style={styles.cardTitle}>Minutes by Category</Text>
              {categoryData.length === 0 ? (
            <Text style={styles.emptyText}>No data available in this period</Text>
          ) : (
            <View style={styles.chartWrap}>
              <PieChart widthAndHeight={widthAndHeight} series={series}/>
            </View>
          )}
        </View>
         <View style={styles.card}>
            <Text style={styles.cardTitle}>Breakdown</Text>
            {categoryData.length === 0 ? (
                <Text style={styles.emptyText}>No categories</Text>
            ) : (
                categoryData.map((data) => (
                <View key={data.id} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: data.colour }]} />
                    <Text style={styles.legendText}>{data.icon} {data.name}: {data.minutes} mins</Text>
                </View>
                ))
            )}
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
  listContent: {
    paddingBottom: 24,
    paddingTop: 14,
  },
  periodRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderColor: '#d6d6d6',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#00b4d0',
    borderColor: '#00b4d0',
  },
  periodButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  activeButtonText: {
    color: '#ffffff',
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
  chartWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    marginRight: 10,
  },
  legendText: {
    color: '#334155',
    fontSize: 15,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 12,
  },
});