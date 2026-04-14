import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: 'Holiday/Trip Planner' }}
      />
    </Tabs>
  );
}
